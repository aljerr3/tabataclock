import React from 'react'
import { useState, useEffect } from 'react'

function Prueba() {
    const [Contador, setContador] = useState(0);

    useEffect(() => {

        Contador += 1;
        console.log(Contador);

    }

    ), []


  return (
    <div>
        

    </div>
  )
}

export default Prueba