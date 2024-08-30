import {useState, useCallback, useRef} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toPng } from 'html-to-image';

const paletteSize = 7;
const ColorPlate = ({color,index, lockStatus, onIconClick})=>{
    
    const copyColorCode = (e)=>{
        navigator.clipboard.writeText(e.target.innerText);
        toast("Copied!");
    }

    const lockColorCode = (e)=>{
        onIconClick(index)
    }

    return(
        <div style={{backgroundColor:color}} className=" flex flex-col gap-4 items-center justify-center text-xl font-semibold group relative">
            <p onClick={copyColorCode} className="hover:cursor-pointer p-2 hover:">{color}</p>
            <div className="cursor-pointer hidden md:group-hover:block absolute mt-24" onClick={lockColorCode}>
            {lockStatus ? 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
            </svg>
            : 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
            </svg>
            }
            </div>
            </div>
    )
}

const generateRandomColor = ()=>{
    let colorCode = '#';
    for(let i=0; i<3 ; i++){
        let colorInput = Math.random() * 256;
        colorCode += parseInt(colorInput).toString(16).padStart(2,'0');
    }
    return colorCode;
}

const App = ()=>{
    const ref = useRef(null)
    const [lockStatusArray, setLockStatusArray] = useState(Array.from({length:paletteSize} , ()=>{return false}));
    const [colors, setColors] = useState(Array.from({length:paletteSize} , generateRandomColor));

    const downloadBtn = useCallback(() => {
        if (ref.current === null) {
            return
        }
    
        toPng(ref.current, { cacheBust: true, })
            .then((dataUrl) => {
            const link = document.createElement('a')
            link.download = 'color-palette.png'
            link.href = dataUrl
            link.click()
            })
            .catch((err) => {
            console.log(err)
            })
        }, [ref])
    

    const swapColorPalette = ()=>{
        let newColors = [];
        for(let i=0; i<paletteSize;i++){
            if(lockStatusArray[i]){
                newColors[i] = colors[i]
            }else{
                newColors[i] = generateRandomColor();
            }
        }
        setColors(newColors)
    }

    const toggleLock = (index)=>{
        const newLockStatusArray = [...lockStatusArray]
        newLockStatusArray[index] = !lockStatusArray[index]
        setLockStatusArray(newLockStatusArray)
    }

    document.body.onkeyup = function(e) {
        if(e.key == " " || e.code == "Space"){
            swapColorPalette()
        }
    }

    return(
        <div className="flex flex-col h-screen">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                theme="dark"
            />
            <div className=" h-16 flex items-center justify-between border  shadow-md px-6 md:px-8 lg:px-12">
                <h1 className="text-2xl font-bold text-slate-500">pickColors.</h1>
                <button className="text-md  font-bold text-slate-500 bg-linen p-1 px-3 rounded-full border-2 border-slate-500" onClick={downloadBtn}>Download</button>
            </div>
            <div ref={ref} className="grow p-6 py-10 grid grid-cols-1 md:grid-cols-7">

            {
                colors.map((color,indexValue)=>{
                    return <ColorPlate key={indexValue} color={color} index={indexValue} onIconClick = {toggleLock}lockStatus={lockStatusArray[indexValue] } />
                })
            }
            
            </div>
        </div>
    )
}

export default App;