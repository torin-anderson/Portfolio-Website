"use client"

import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { ContactShadows, Float, Environment} from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { gsap } from "gsap/gsap-core"



export default function Shapes(){
    return(
        <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas className="z-0" shadows gl= {{antialias:false}} dpr={[1,1.5]} 
            camera={{position: [0,0,25], fov:30, near:1, far:40}}>
        <Suspense fallback={null}>
            <Geometries/>
            <ContactShadows position={[0,-3.5,0]} opacity={0.65} scale={40} blur={1} far={9}/>
            <Environment preset="studio"/>
        </Suspense>
            </Canvas>
        </div>
    )
}

function Geometries(){
    //creates different shapes and places them with spin speed
    const geometries = [
        {
            position: [0,0,0],
            r: 0.3,
            geomtry: new THREE.IcosahedronGeometry(3) //gem
        },
        {
            position: [1,-0.75,2],
            r: 0.5,
            geomtry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16) //pill
        },
        {
            position: [-1.05,.9,4],
            r: 0.4,
            geomtry: new THREE.TorusKnotGeometry(.7,.28) //knot
        },
        {
            position: [1.7,1,-2],
            r: 0.3,
            geomtry: new THREE.TorusGeometry() //ring
        },
        {
            position: [-1.5,-1,-1],
            r: 0.3,
            geomtry: new THREE.ConeGeometry() //cone
        }
    ]

    //colors for different geometries
    const materials = [
        new THREE.MeshNormalMaterial(),
        new THREE.MeshStandardMaterial({color:0xf6b93b}), //orange
        new THREE.MeshStandardMaterial({color:0xe55039}), //red
        new THREE.MeshStandardMaterial({color:0x4a69bd}), //blue
        new THREE.MeshStandardMaterial({color:0x60a3bc}), //teal
        new THREE.MeshStandardMaterial({color:0x78e08f}), //green
        new THREE.MeshStandardMaterial({color:0xaaa69d, metalness:1}) //silver
    ];

    //implements sound effects for when you hit the shapes on the home page
    const soundEffects = [
        new Audio("/sounds/bell.ogg"),
        new Audio("/sounds/metal.ogg"),
        new Audio("/sounds/punch.ogg")
    ]
    

    return geometries.map(({position, r, geomtry})=>(
        <Geometry
        key={(JSON.stringify(position))}
        position={position.map((p)=>p*2)}
        soundEffects={soundEffects}
        geometry={geomtry}
        materials={materials}
        r={r}
        />
    ))

}

function Geometry({r,position,geometry,materials, soundEffects}){
    const meshRef = useRef()
    const [visible, setVisible] = useState(false)
    const startingMaterial = getRandomMaterial()

        function getRandomMaterial(){
            return gsap.utils.random(materials)
        }

        //for ball turning on click
        function handleClick(e){
            const mesh = e.object;

            gsap.utils.random(soundEffects).play()

            gsap.to(mesh.rotation,{
                x: `+=${gsap.utils.random(0,2)}`,
                y: `+=${gsap.utils.random(0,2)}`,
                z: `+=${gsap.utils.random(0,2)}`,
                duration: 1.3,
                ease: "elastic.out(1,0.5)",
                yoyo:true
            });
            mesh.material = getRandomMaterial();
        }

    const handlePointerOver = ()=>{
        document.body.style.cursor = "pointer"
    }
    const handlePointerOut = ()=>{
        document.body.style.cursor = "default"
    }

    //ball popping in
    useEffect(()=>{
        let ctx = gsap.context(()=>{
            setVisible(true)
            gsap.from(meshRef.current.scale,
            {
                x:0,
                y:0,
                z:0,
                duration: 1,
                ease: 'elastic.out(1,0.5)',
                delay:0.3
            });
        });
        return ()=>ctx.revert() ///cleanup
    }, [])

    return (
        <group position={position} ref={meshRef}>
            <Float speed={5 * r} rotationIntensity={6*r} floatIntensity={5*r}>
                <mesh
                geometry = {geometry}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                visible={visible}
                material={startingMaterial}
                />
            </Float>
        </group>
    )
}