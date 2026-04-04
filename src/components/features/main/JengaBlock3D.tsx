import { motion } from 'framer-motion-3d';
import { Edges} from '@react-three/drei';

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
  STANDARD: { color: '#f0d9b5', roughness: 0.7 },
  CHEER:    { 
    color: '#FFD700', 
    roughness: 0.2, 
    metalness: 1.0, 
    emissive: '#FF8000', 
    emissiveIntensity: 0.8 
  },

  // ─── 기존 소문자 타입 호환성 유지 ──────────────
  standard: { color: '#f0d9b5', roughness: 0.7 },
  stress:   { color: '#e8a08a', roughness: 0.7 },
  joy:      { color: '#f5e6c8', roughness: 0.7 },
  anxiety:  { color: '#a3d4b5', roughness: 0.7 },
  sadness:  { color: '#8e94b0', roughness: 0.7 },
  anger:    { color: '#e07070', roughness: 0.7 },
  calm:     { color: '#d4ecd8', roughness: 0.7 },
  fatigue:  { color: '#b5bcc8', roughness: 0.7 },
};

export interface JengaBlock3DProps {
  position: [number, number, number];
  rotation: [number, number, number];
  blockType?: string;
  isCollapsed?: boolean;
  floorIndex: number; 
  blockIndex: number;
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
  
  const mat = BLOCK_MATERIAL[blockType.toUpperCase()] ?? 
              BLOCK_MATERIAL[blockType] ?? 
              BLOCK_MATERIAL.STANDARD;

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
    <motion.group
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
              damping: 25,
              mass: 2.5
            }
          : {
              type: 'spring',
              stiffness: 120,
              damping: 14,
              mass: 1.2,
              delay: blockIndex * 0.08,
            }
      }
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 1, 1]} />
        <meshStandardMaterial 
          color={mat.color} 
          roughness={mat.roughness}
          metalness={mat.metalness ?? 0.05}
          emissive={mat.emissive ?? '#000000'}
          emissiveIntensity={mat.emissiveIntensity ?? 0}
        />
        <Edges threshold={15} color="#000000" />
      </mesh>
    </motion.group>
  );
};

export default JengaBlock3D;
