import { useEffect , useState } from "react";

const Samet=() => {
    const[sayac,setSayac] = useState (0)
    const[msj,setMsj]= useState("")
    useEffect(()=>{

        if(sayac!==0){
            setMsj("Değer arttı"+sayac)
        }


    }, [sayac])
    return(
        <>
            <p>

            </p>
            {msj}
            <p>

                {sayac} <br/>
                <button onClick={()=>{
                    setSayac(sayac+1)
                }}> arttır</button>
            </p>

        </>
    )
}

export default Samet