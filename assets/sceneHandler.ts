import {
    AmbientLight, BufferGeometry, Material,
    Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D,
    OrthographicCamera,
    PointLight,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useUserDataStore} from "~/store/userData";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {scalarOptions} from "yaml";
import Str = scalarOptions.Str;
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

// レンダラーにはcanvasを紐づける。
// レンダリング時にシーンとカメラを指定する。
// 分割ビュー実装時はレンダラーを複数立ててレンダリングする

type CtrlCenter = {
    pos0: Vector3
    tgt0: Vector3
    zoom0: number
}

type ObjectMetaData = {
    id: string,
    mat: Material
}

const defaultMetaData: ObjectMetaData = {
    id: 'default',
    mat: new MeshPhongMaterial({
            color: '#FF0000',
            shininess: 50,
            specular: '#323232'
        }
    )
}

const minZoomScale = 1e-1
const maxZoomScale = 10

export default class SceneHandler {
    // General settings
    private canvas: HTMLCanvasElement
    private renderer: WebGLRenderer

    // Scene settings
    private scene = new Scene()

    // Camera settings
    private camera: OrthographicCamera
    private factor = 4
    private camNear = 1
    private camFar = 3000
    private camDistance = -500
    private camCtrl: OrbitControls

    // Objects

    // userState
    private userData = useUserDataStore()

    constructor (canvas: HTMLCanvasElement) {
        // get basic env vars
        this.canvas = canvas
        const r = this.canvas.getBoundingClientRect()
        const w = r.width
        const h = r.height

        // init camera
        this.camera = new OrthographicCamera(
            w / -this.factor,
            w / this.factor,
            h / this.factor,
            h / -this.factor,
            this.camFar,
            this.camNear
        )

        this.camera.position.set(-this.camDistance, minZoomScale, maxZoomScale)
        this.camera.lookAt(0, 0, 0)
        this.camCtrl = this.createCameraControls(this.camera, minZoomScale, maxZoomScale)

        // initialize scene and renderer
        this.renderer = new WebGLRenderer({
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
            canvas
        })

        this.renderer.localClippingEnabled = true
        this.renderer.setSize(w, h)

        // add objects and lights
        const light0 = new AmbientLight('#FFFFFF', 0.65)
        this.scene.add(light0)

        const light1 = new PointLight('#FFFFCC', 0.5)
        light1.position.set(1000, 1000, 0)
        this.scene.add(light1)

        const light2 = new PointLight('#FFFFCC', 0.5)
        light2.position.set(-1000, -1000, 0)
        this.scene.add(light2)

        console.log('This scene has been initialized.')
        this.canvas = canvas
    }

    private getMesh = (meta: ObjectMetaData) => {
        const tgtObj = this.scene.getObjectByName(meta.id)
        if (typeof tgtObj !== 'undefined') {
            return tgtObj
        } else {
            return null
        }
    }

    public importGeometry = (): Promise<void> => {
        let procTime = Date.now()
        const fileExt = this.userData.fileExt
        const mainMetaData:ObjectMetaData = {
            id: 'main',
            mat: defaultMetaData.mat
        }

        return new Promise((resolve, reject) => {
            try {
                if (fileExt === 'stl' || fileExt === "STL"){
                    this.importSTL(this.userData.dataURL, mainMetaData)
                }
                if (fileExt === 'obj' || fileExt === 'OBJ'){
                    this.importOBJ(this.userData.dataURL, mainMetaData)
                }
                else{
                    procTime = Date.now() - procTime
                    console.log('UserData is invalid. skip loading...')
                    throw new Error("UserData is invalid.")
                }

                procTime = Date.now() - procTime
                console.log(mainMetaData.id + ' is loaded successfully. [ ' + procTime + 'ms ]')
                this.update()
                resolve()
            } catch (e) {
                procTime = Date.now() - procTime
                console.log('loading ' + mainMetaData.id + ' is failed. [ ' + procTime + 'ms ]')
                reject()
            }
        })
    }

    private importSTL = (url: string, meta = defaultMetaData) => {
        const loader = new STLLoader()
        loader.load(
            url,
            (geo) => {this.addGeometryBufferToScene(meta, geo)},
            (e) => {console.log( ( e.loaded / e.total * 100 ) + '% loaded' )},
            (e) => {console.log( 'An error happened on data loading' )
            }
        )
    }

    private addGeometryBufferToScene = (meta:ObjectMetaData, geo: BufferGeometry) => {
        const oldObj: any = this.getMesh(meta)
        if (oldObj !== null){
            this.scene.remove(oldObj)
            oldObj.geometry.dispose()
            console.log('previous object of "' + meta.id + '" has been deleted.')
        }

       geo.computeBoundingBox()
        const bb = geo.boundingBox
        const center = new Vector3()
        bb?.getCenter(center)
        geo.translate(-center.x, -center.y, -center.z) // shift to center


        const mat = meta.mat
        const obj = new Mesh(geo, mat)
        obj.name = meta.id
        obj.rotation.set(0, 0, 0 * Math.PI)
        this.scene.add(obj)
    }

    private importOBJ = (url: string, meta = defaultMetaData) => {
        const loader = new OBJLoader()
        const scene = this.scene
        loader.load(
            url,
            (obj) => {
                const oldObj: any = this.getMesh(meta)
                if (oldObj !== null){
                    this.scene.remove(oldObj)
                    oldObj.geometry.dispose()
                    console.log('previous object of "' + meta.id + '" has been deleted.')
                }

                obj.children.forEach(function (objChild: any, _) {
                    if (objChild.type === 'Mesh') {
                        objChild.material = meta.mat
                        objChild.material.flatShading = true
                        objChild.name = meta.id
                        objChild.rotation.set(0, 0, Math.PI)
                        scene.add(objChild)
                    }
                })
            },
            (e) => {console.log( ( e.loaded / e.total * 100 ) + '% loaded' )},
            (e) => {console.log( 'An error happened on data loading' )}
        )
    }

    private createCameraControls = (camera: OrthographicCamera, minZoomScale:number, maxZoomScale:number) => {
        const camCtrl = new OrbitControls(camera, this.canvas)
        camCtrl.minZoom = minZoomScale
        camCtrl.maxZoom = maxZoomScale
        camCtrl.panSpeed = 1.25
        camCtrl.rotateSpeed = 0.5
        camCtrl.zoomSpeed = 1.5
        camCtrl.screenSpacePanning = false
        camCtrl.enableDamping = false
        camCtrl.addEventListener('change', () => {
            this.update()
        })
        return camCtrl
    }

    public update = () => {
        this.renderer.render(this.scene, this.camera)
    }

}



