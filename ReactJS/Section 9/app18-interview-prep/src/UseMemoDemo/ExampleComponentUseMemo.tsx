import React, { useMemo, useState } from 'react'

const ExampleComponentUseMemo = () => {
    const [items,setItems] = useState(['Apple', 'Banana', 'Cherry', 'Date'])
      const [count,setCount] = useState(0)
        console.log("I am from  ")
    const [itemName, setIteName] = useState('')

    const filteredItems = useMemo(() => {
        console.log("filteredItems called !!!")
        return items.filter((item) => item.toLowerCase().includes(itemName.toLowerCase()))
    }, [items, itemName])

    const handleChange = (e) => {
        setIteName(e.target.value)
    }

    return (
        <div>
                  <button onClick={()=>{setCount(count+10)}}>Change Count - {count}</button>

            <input type="text" name="" id="" onChange={handleChange} />
            <ul>
                {filteredItems.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    )
}

export default React.memo(ExampleComponentUseMemo)
