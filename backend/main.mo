import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type YearOfStudy = {
    #year1;
    #year2;
    #year3;
    #year4;
  };

  type PlanType = {
    #free;
    #pro;
  };

  public type UserProfile = {
    fullName : Text;
    collegeName : Text;
    course : Text;
    yearOfStudy : YearOfStudy;
    targetCareer : Text;
    plan : PlanType;
  };

  public type StudyTask = {
    subject : Text;
    topic : Text;
    deadline : Time.Time;
    status : TaskStatus;
  };

  public type TaskStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  public type FocusSession = {
    duration : Nat; // in minutes
    date : Time.Time;
  };

  public type ChatMessage = {
    message : Text;
    response : Text;
    timestamp : Time.Time;
  };

  module ChatMessage {
    public func compare(message1 : ChatMessage, message2 : ChatMessage) : Order.Order {
      Int.compare(message1.timestamp, message2.timestamp);
    };
  };

  public type CareerRoadmap = {
    degree : Text;
    targetJob : Text;
    timeline : Text;
    skillRoadmap : [Text];
    recommendedTools : [Text];
    projectSuggestions : [Text];
    internshipPath : [Text];
  };

  public type ScheduledTask = {
    day : Nat;
    topics : [Text];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let studyTasks = Map.empty<Principal, List.List<StudyTask>>();
  let focusSessions = Map.empty<Principal, List.List<FocusSession>>();
  let chatHistory = Map.empty<Principal, List.List<ChatMessage>>();
  let careerRoadmaps = Map.empty<Principal, CareerRoadmap>();

  public type DailyTaskResult = {
    dailyBreakdown : [{ day : Nat; topics : [Text] }];
    startDate : Time.Time;
    endDate : Time.Time;
    estimatedCompletionDays : Nat;
  };

  public type StudyTaskSummary = {
    totalTasks : Nat;
    completedTasks : Nat;
    pendingTasks : Nat;
    inProgressTasks : Nat;
    completionPercentage : Float; // e.g., 75.5 for 75.5%
  };

  public query ({ caller }) func getDashboardData() : async {
    profile : ?UserProfile;
    tasks : [StudyTask];
    focusStats : {
      totalSessions : Nat;
      totalTime : Nat;
      dailyAverage : Float;
    };
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dashboard data");
    };
    {
      profile = userProfiles.get(caller);
      tasks = switch (studyTasks.get(caller)) {
        case (null) { [] };
        case (?list) { list.toArray() };
      };
      focusStats = calculateFocusStats(caller);
    };
  };

  // Helper function to calculate focus session stats
  func calculateFocusStats(user : Principal) : { totalSessions : Nat; totalTime : Nat; dailyAverage : Float } {
    switch (focusSessions.get(user)) {
      case (null) {
        { totalSessions = 0; totalTime = 0; dailyAverage = 0.0 };
      };
      case (?sessions) {
        let sessionArray = sessions.toArray();
        let totalSessions = sessionArray.size();
        let totalTime = sessionArray.foldLeft(
          0,
          func(acc, session) { acc + session.duration },
        );
        let dailyAverage = if (totalSessions > 0) {
          totalTime.toFloat() / totalSessions.toFloat();
        } else { 0.0 };
        {
          totalSessions;
          totalTime;
          dailyAverage;
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addStudyTask(task : StudyTask) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add study tasks");
    };
    let userTasks = switch (studyTasks.get(caller)) {
      case (null) { List.empty<StudyTask>() };
      case (?tasks) { tasks };
    };
    userTasks.add(task);
    studyTasks.add(caller, userTasks);
  };

  public shared ({ caller }) func updateStudyTask(index : Nat, updatedTask : StudyTask) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update study tasks");
    };
    switch (studyTasks.get(caller)) {
      case (null) {
        Runtime.trap("No tasks found for user");
      };
      case (?tasks) {
        if (index >= tasks.size()) {
          Runtime.trap("Task index out of bounds");
        };
        let taskArray = tasks.toArray();
        let newTaskArray = Array.tabulate(
          taskArray.size(),
          func(i) {
            if (i == index) { updatedTask } else { taskArray[i] };
          },
        );
        let newTaskList = List.fromArray<StudyTask>(newTaskArray);
        studyTasks.add(caller, newTaskList);
      };
    };
  };

  public shared ({ caller }) func deleteStudyTask(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete study tasks");
    };
    switch (studyTasks.get(caller)) {
      case (null) {
        Runtime.trap("No tasks found for user");
      };
      case (?tasks) {
        if (index >= tasks.size()) {
          Runtime.trap("Task index out of bounds");
        };
        let taskArray = tasks.toArray();
        let newTaskArray = Array.tabulate(
          taskArray.size() - 1,
          func(i) {
            if (i < index) { taskArray[i] } else { taskArray[i + 1] };
          },
        );
        let newTaskList = List.fromArray<StudyTask>(newTaskArray);
        studyTasks.add(caller, newTaskList);
      };
    };
  };

  public query ({ caller }) func getStudyTasks() : async [StudyTask] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access study tasks");
    };
    switch (studyTasks.get(caller)) {
      case (null) { [] };
      case (?tasks) { tasks.toArray() };
    };
  };

  public query ({ caller }) func getTaskSummary() : async StudyTaskSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access task summary");
    };
    switch (studyTasks.get(caller)) {
      case (null) {
        { totalTasks = 0; completedTasks = 0; pendingTasks = 0; inProgressTasks = 0; completionPercentage = 0.0 };
      };
      case (?tasks) {
        let taskArray = tasks.toArray();
        let totalTasks = taskArray.size();
        let completedTasks = taskArray.filter(func(task) { task.status == #completed }).size();
        let pendingTasks = taskArray.filter(func(task) { task.status == #pending }).size();
        let inProgressTasks = taskArray.filter(func(task) { task.status == #inProgress }).size();
        let completionPercentage = if (totalTasks > 0) {
          (completedTasks.toFloat() / totalTasks.toFloat()) * 100.0;
        } else { 0.0 };
        {
          totalTasks;
          completedTasks;
          pendingTasks;
          inProgressTasks;
          completionPercentage;
        };
      };
    };
  };

  public shared ({ caller }) func addFocusSession(session : FocusSession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add focus sessions");
    };
    let userSessions = switch (focusSessions.get(caller)) {
      case (null) { List.empty<FocusSession>() };
      case (?sessions) { sessions };
    };
    userSessions.add(session);
    focusSessions.add(caller, userSessions);
  };

  public query ({ caller }) func getFocusSessions() : async [FocusSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access focus sessions");
    };
    switch (focusSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions.toArray() };
    };
  };

  public shared ({ caller }) func addChatMessage(chat : ChatMessage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add chat messages");
    };
    let userChats = switch (chatHistory.get(caller)) {
      case (null) { List.empty<ChatMessage>() };
      case (?chats) { chats };
    };
    userChats.add(chat);
    chatHistory.add(caller, userChats);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat history");
    };
    switch (chatHistory.get(caller)) {
      case (null) { [] };
      case (?chats) {
        chats.toArray().sort();
      };
    };
  };

  public shared ({ caller }) func saveCareerRoadmap(roadmap : CareerRoadmap) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save career roadmaps");
    };
    careerRoadmaps.add(caller, roadmap);
  };

  public query ({ caller }) func getCareerRoadmap() : async ?CareerRoadmap {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access career roadmaps");
    };
    careerRoadmaps.get(caller);
  };

  public shared ({ caller }) func upgradeToPro() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade to Pro");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?profile) {
        let updatedProfile = {
          profile with
          plan = #pro;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func addCalendarEvent(startDate : Time.Time, endDate : Time.Time, date : Time.Time) : async DailyTaskResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add calendar events");
    };
    let durationDays = calculateDaysBetween(startDate, endDate);
    let dailyBreakdown = createDailyBreakdown(durationDays);

    {
      dailyBreakdown;
      startDate;
      endDate;
      estimatedCompletionDays = durationDays;
    };
  };

  func calculateDaysBetween(startTime : Time.Time, endTime : Time.Time) : Nat {
    let nanosecondsPerDay : Int = 24 * 60 * 60 * 1_000_000_000;
    let timeDifference = endTime - startTime;
    let daysInt : Int = timeDifference / nanosecondsPerDay;
    let days : Nat = if (daysInt > 0) { Int.abs(daysInt) } else { 0 };
    if (days == 0) { 1 } else {
      days;
    };
  };

  func createDailyBreakdown(durationDays : Nat) : [{ day : Nat; topics : [Text] }] {
    Array.tabulate<{ day : Nat; topics : [Text] }>(
      durationDays,
      func(day) {
        {
          day = day + 1;
          topics = switch (day % 3) {
            case (0) { [ "Revision", "Practice Questions" ] };
            case (1) { [ "Read New Material", "Summarize Notes" ] };
            case (2) { [ "Group Study", "Quiz Yourself" ] };
            case (_) { [ "General Review" ] };
          };
        };
      },
    );
  };
};
