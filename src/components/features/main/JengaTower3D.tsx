import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, ContactShadows } from '@react-three/drei';
import type { Group } from 'three';
import JengaBlock3D from './JengaBlock3D';

// ─── ERD 스키마 타입 ──────────────────────────────────────────
export interface TowerData {
  stability_score: number;   // 0~100
  collapsed: boolean;
  total_floors: number;
}

export interface BlockData {
  floor_index: number;
  position_index: number;
  block_type: string;
  message: string;
}

interface JengaTower3DProps {
  tower: TowerData;
  blocks: BlockData[];
}

// ─── 물리 상수 ────────────────────────────────────────────────
const BLOCK_SPACING = 1.05;
const FLOOR_HEIGHT = 1.05;

function calcBlockTransform(floorIndex: number, positionIndex: number): {
  position: [number, number, number];
  rotation: [number, number, number];
} {
  const isEven = floorIndex % 2 === 0;
  // 바닥 띄우기: y=0이 바닥이 되도록
  const y = floorIndex * FLOOR_HEIGHT + 0.5;
  const offset = (positionIndex - 1) * BLOCK_SPACING;

  if (isEven) {
    return { position: [0, y, offset], rotation: [0, 0, 0] };
  } else {
    return { position: [offset, y, 0], rotation: [0, Math.PI / 2, 0] };
  }
}

/** 붕괴(collapsed) 시 적용할 사방으로 퍼지는 부드러운 산개(scatter) 함수 */
function calcCollapsedOffsets(floorIndex: number, positionIndex: number): {
  posOffset: [number, number, number];
  rotOffset: [number, number, number];
} {
  const fallFactor = Math.min(1, floorIndex / 8);
  // positionIndex에 따라 고유한 각도 생성 (0, 1, 2 = 120도 간격 + 층별 회전)
  const angle = (positionIndex * (Math.PI * 2 / 3)) + (floorIndex * 0.5);
  
  const radius = fallFactor * 5.5; // 퍼지는 반경
  const posOffset: [number, number, number] = [
    Math.cos(angle) * radius * (Math.sin(floorIndex * 1.2) + 1.2), // X축으로 부드럽게 퍼짐
    -fallFactor * floorIndex * 0.25, // Y축으로 살짝 가라앉음
    Math.sin(angle) * radius * (Math.cos(floorIndex * 1.1) + 1.2), // Z축으로 부드럽게 퍼짐
  ];
  
  const rotOffset: [number, number, number] = [
    Math.sin(floorIndex * 1.7) * fallFactor * 2.5,
    Math.cos(floorIndex * 2.3) * fallFactor * 2.4,
    Math.sin(floorIndex * 2.1 + 0.5) * fallFactor * 2.6,
  ];
  return { posOffset, rotOffset };
}

// ─── 흔들림 관리 전용 그룹 ────────────────────────────────────
interface ShakerGroupProps {
  tower: TowerData;
  blocks: BlockData[];
}

const ShakerGroup = ({ tower, blocks }: ShakerGroupProps) => {
  const groupRef = useRef<Group>(null);
  const { stability_score, collapsed } = tower;

  // 안정도가 60 미만일 때 진동 발생
  useFrame((state) => {
    if (!groupRef.current || collapsed) return;
    
    // 60 미만일 때부터 흔들림 강도 증가 (1.0 = 최대치)
    const shakeIntensity = stability_score < 60 
      ? Math.max(0, (60 - stability_score) / 60)
      : 0;
      
    if (shakeIntensity > 0) {
      const t = state.clock.elapsedTime;
      const amplitude = shakeIntensity * 0.08;
      const freq = 15 + shakeIntensity * 20; // 빠르고 자잘한 흔들림

      groupRef.current.position.x = Math.sin(t * freq) * amplitude;
      groupRef.current.position.z = Math.cos(t * freq * 1.1) * amplitude;
      groupRef.current.rotation.z = Math.sin(t * freq * 0.8) * (amplitude * 0.5);
    } else {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {blocks.map((block, i) => {
        const { position, rotation } = calcBlockTransform(
          block.floor_index,
          block.position_index,
        );

        const { posOffset, rotOffset } = collapsed
          ? calcCollapsedOffsets(block.floor_index, block.position_index)
          : { posOffset: [0, 0, 0] as [number, number, number], rotOffset: [0, 0, 0] as [number, number, number] };

        return (
          <JengaBlock3D
            key={`block-${block.floor_index}-${block.position_index}-${i}`}
            position={position}
            rotation={rotation}
            blockType={block.block_type}
            floorIndex={block.floor_index}
            blockIndex={i}
            isCollapsed={collapsed}
            collapsedOffset={posOffset}
            collapsedRotation={rotOffset}
          />
        );
      })}
    </group>
  );
};

// ─── 렌더링 ──────────────────────────────────────────────────
const JengaTower3D = ({ tower, blocks }: JengaTower3DProps) => {
  const towerHeight = tower.total_floors * FLOOR_HEIGHT;
  const midHeight = towerHeight / 2;
  const cameraPos: [number, number, number] = [12, 18, 24]; // 타워가 버튼과 겹치지 않도록 더 멀리 쿼터뷰

  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto flex items-center justify-center">
      <Canvas
        shadows
        camera={{ position: cameraPos, fov: 48, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => {
          // 타워가 위로 올라간 만큼, 카메라도 중심점을 올려다보도록 타겟 조정
          camera.lookAt(0, 4, 0); 
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.65} color="#ffffff" />
          <directionalLight
            position={[10, 20, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#fffbf5"
          />
          <pointLight position={[-8, midHeight, -8]} intensity={0.5} color="#b2c0cc" />

          {/* 투명한 바닥 받침 - 위치 상향 조정 */}
          <mesh position={[0, -2.15, 0]} receiveShadow>
            <cylinderGeometry args={[4.5, 4.5, 0.3, 32]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false} />
          </mesh>

          {/* PresentationControls: 자연스러운 회전 + 튕김 복귀 제공 */}
          <PresentationControls
            global
            snap={true}
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-0.05, 0.05]}   // 상하 회전 매우 미세하게 한정적 허용
            azimuth={[-Math.PI / 1.1, Math.PI / 1.1]} // 좌우 거의 360도 수준으로 크게 허용
          >
            {/* 전체 그룹: 화면 상단으로 타워를 올려 하단 UI 버튼을 절대 가리지 않게 물리적 이격 */}
            <group position={[0, -2, 0]}>
              <group rotation={tower.collapsed ? [0, 0, -0.3] : [0, 0, 0]}>
                <ShakerGroup tower={tower} blocks={blocks} />
              </group>
              
              <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.6}
                scale={18}
                blur={2.5}
                far={10}
                color="#000000"
              />
            </group>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default JengaTower3D;
