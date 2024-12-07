import { PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Camera = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    /*
        [ useFrame ]
        1초 25프레임 24FPS
        매 프레임마다 호출
        useEffect와 달리, 매 프레임마다 상태를 업데이트해야 하는 경우에 사용
    */
    useFrame(()=>{
        if(cameraRef.current){
            cameraRef.current.rotation.y += 0.1;
        }
    })

    return (
        <PerspectiveCamera 
            ref={cameraRef}
            makeDefault // 기본카메라로 설정
            position={[0,2,5]} // 카메라 위치
            rotation={[(-Math.PI/180)*10, 0,0]}
            fov={75} // 시야각
            near={0.1} // 가까운 클리핑 거리
            far={1000} // 먼 클리핑 거리
        />
    )
}

const TwoNodeCamera = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    /*
        [ THREE.Vector3 ]
        Three.js 라이브러리에서 제공하는 3차원 벡터 클래스
        x,y,z 좌표를 가진 3차원 공간의 점이나 방향을 나타냄
        만약 Three.js 라이브러리의 메서드나 속성에서 사용될 때 좌표값을 이렇게 넣음
    */
    const targetPosition = new THREE.Vector3(0, 2, 0); // 카메라가 바라볼 지점

    useFrame(()=>{
        if(cameraRef.current){
            cameraRef.current.lookAt(targetPosition);
            cameraRef.current.rotation.y += 0.1;
        }
    })

    return (
        <PerspectiveCamera 
            ref={cameraRef}
            makeDefault 
            position={[0,2,5]} 
            rotation={[(-Math.PI/180)*10, 0,0]}
            fov={75} 
            near={0.1} 
            far={1000}
        />
    )
}


const PivotCamera = () => {
    const pivotRef = useRef<THREE.Group>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
 
    useFrame(()=>{
        if(pivotRef.current){
            pivotRef.current.rotation.y += 0.1;
        }
    })

    return (
        // pivot의 중심점
        <group ref={pivotRef} position={[0,2,0]}> 
            <PerspectiveCamera 
                ref={cameraRef}
                makeDefault 
                position={[0,0,5]} 
                fov={75} 
                near={0.1} 
                far={1000}
            />
        </group>
    )
}

/*
    [ useThree ]
    three js에서 다룰 수 있는 오브젝트들을 넣어놓은 hook
    
    [ useThree로 기본 카메라 접근하는 방법 ]
    PersepectiveCamera를 만들지 않고 현재 활성화된 카메라를 참조
*/
const ThreeCamera = () => {
    const { camera, set } = useThree();
    
    useEffect(()=>{
        // 카메라 초기 설정
        camera.position.set(0, 2, 5);
        camera.rotation.x = (-Math.PI / 180) * 10;
        camera.updateProjectionMatrix();

        // 기본 카메라로 설정
        set({camera});
    },[camera, set]);

    useFrame(()=>{
        camera.rotation.y += 0.1;
    })

    return null;
}

const SmoothCamera = () => {
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3(2,2,2));

    useFrame(()=>{
        /*
            [ lerp ]
            목표 위치로 부드럽게 이동하는 메서드
            lerp(목표위치, 이동속도)
        */
        camera.position.lerp(targetPosition.current, 0.05);

        camera.lookAt(0,0,0); // 카메라 시선고정
    })

    return null;
}

const Three03 = () => {
  return (
    <>
        <div className='h-screen'>
            <Canvas>
                <ambientLight intensity={5} />

                {/* <Camera /> */}
                {/* <TwoNodeCamera /> */}
                {/* <PivotCamera /> */}
                {/* <ThreeCamera /> */}
                <SmoothCamera />
                <mesh position={[0,0,0]}>
                    <boxGeometry args={[1,1,1]} />
                    <meshStandardMaterial color={'red'} />
                </mesh>
            </Canvas>
        </div>
    </>
  )
}

export default Three03