import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.5}>
                <MeshDistortMaterial
                    color="#6366f1"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

export default function ThreeHero() {
    return (
        <div className="w-full h-[300px] relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-950/20 to-background border border-indigo-500/20 shadow-inner">
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#818cf8" />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#c084fc" />
                    <AnimatedSphere />
                </Canvas>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/10 backdrop-blur-[1px]">
                <h2 className="text-4xl font-black tracking-tight text-white mb-2 drop-shadow-md">
                    ACADEMIA <span className="text-primary italic">CORE</span>
                </h2>
                <p className="text-indigo-200/80 font-medium max-w-sm">
                    AI-powered neuro-rhythmic study system.
                    Your cognitive twin is active.
                </p>
            </div>
        </div>
    );
}
