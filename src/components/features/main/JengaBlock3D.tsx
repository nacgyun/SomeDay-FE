import { useRef } from 'react';
import type { Mesh } from 'three';
import { motion } from 'framer-motion-3d';
import { Edges } from '@react-three/drei';

const BLOCK_MATERIAL: Record<
  string,
  { 
    color: string; 
    roughness: number; 
    metalness?: number; 
    emissive?: string; 
    emissiveIntensity?: number;
  }
> = {
  // ─── 유저 명세 기반 타입 (대문자) ──────────────
  STANDARD: { color: '#C4A484', roughness: 0.8 }, // 따뜻한 나무 느낌의 베이지
  CHEER:    { 
    color: '#FFD700', 
    roughness: 0.2, 
    metalness: 1.0, 
    emissive: '#FF8000', 
    emissiveIntensity: 0.8 
  }, // 빛나는 응원 블록 (금속 광택 + 주황빛 발광)

  // ─── 기존 소문자 타입 호환성 유지 ──────────────
  standard: { color: '#C4A484', roughness: 0.8 },
  stress:   { color: '#e07a5f', roughness: 0.8 },
  joy:      { color: '#f4f1de', roughness: 0.8 },
  anxiety:  { color: '#81b29a', roughness: 0.8 },
  sadness:  { color: '#3d405b', roughness: 0.9 },
  anger:    { color: '#c1121f', roughness: 0.9 },
  calm:     { color: '#eef4ed', roughness: 0.8 },
  fatigue:  { color: '#8d99ae', roughness: 0.9 },
};

export interface JengaBlock3DProps {
  position: [number, number, number];
  rotation: [number, number, number];
  blockType?: string;
  isCollapsed?: boolean;
  floorIndex: number; 
  blockIndex: number; // Stagger delay를 위해 사용 (전체 인덱스)
  collapsedOffset?: [number, number, number];
  collapsedRotation?: [number, number, number];
}

const JengaBlock3D = ({
  position,
  rotation,
  blockType = 'standard',
  isCollapsed = false,
  blockIndex,
  collapsedOffset = [0, 0, 0],
  collapsedRotation = [0, 0, 0],
}: JengaBlock3DProps) => {
  const meshRef = useRef<Mesh>(null);
  
  // 대소문자 구분 없이 매핑하기 위해 대문자로 먼저 매칭 시도
  const mat = BLOCK_MATERIAL[blockType.toUpperCase()] ?? 
              BLOCK_MATERIAL[blockType] ?? 
              BLOCK_MATERIAL.STANDARD;

  // Collapse 여부에 따라 최종 목적지 결정
  const targetPosition: [number, number, number] = isCollapsed
    ? [
        position[0] + collapsedOffset[0],
        position[1] + collapsedOffset[1],
        position[2] + collapsedOffset[2],
      ]
    : position;

  const targetRotation: [number, number, number] = isCollapsed
    ? [
        rotation[0] + collapsedRotation[0],
        rotation[1] + collapsedRotation[1],
        rotation[2] + collapsedRotation[2],
      ]
    : rotation;

  return (
    <motion.mesh
      ref={meshRef as any}
      // 초기 상태: 붕괴가 아니라면 하늘 높은 곳(y+15)에서 시작
      initial={isCollapsed ? false : { 
        x: targetPosition[0], 
        y: targetPosition[1] + 15, 
        z: targetPosition[2], 
        rotateX: rotation[0], 
        rotateY: rotation[1], 
        rotateZ: rotation[2] 
      }}
      animate={{
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        rotateX: targetRotation[0],
        rotateY: targetRotation[1],
        rotateZ: targetRotation[2],
      }}
      transition={
        isCollapsed 
          ? { 
              type: 'spring', 
              stiffness: 80, 
              damping: 25, // 붕괴 시 묵직하고 부드러운 산개
              mass: 2.5
            }
          : {
              type: 'spring',
              stiffness: 120, // 쫀득하게 안착
              damping: 14,
              mass: 1.2,
              delay: blockIndex * 0.08, // 0.08초 간격으로 리드미컬하게 스태거링
            }
      }
      castShadow
      receiveShadow
    >
      <boxGeometry args={[3, 1, 1]} />
      <meshStandardMaterial 
        color={mat.color} 
        roughness={mat.roughness}
        metalness={mat.metalness ?? 0.1}
        emissive={mat.emissive ?? '#000000'}
        emissiveIntensity={mat.emissiveIntensity ?? 0}
      />
      
      {/* 만화/일러스트 스타일용 얇은 외곽선 */}
      <Edges scale={1} threshold={15} color="#4a3b32" />
    </motion.mesh>
  );
};

export default JengaBlock3D;
