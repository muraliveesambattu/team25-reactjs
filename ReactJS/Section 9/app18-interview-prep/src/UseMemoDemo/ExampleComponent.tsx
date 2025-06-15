import React, { useState } from 'react'

const ExampleComponent = () => {
  const [items, setItems] = useState(['Orange', 'Grapes', 'Banana', 'Date'])

  const [count, setCount] = useState(0)
  const [itemName, setIteName] = useState('')
  console.log(itemName)
  const filteredItems = items.filter((item) => item.toLowerCase().includes(itemName.toLowerCase()))
  console.log('Filtering items...'); // Log to show when computation runs
  const handleChange = (e) => {
    setIteName(e.target.value)
  }

  return (
    <div>
      <button onClick={() => { setCount(count + 10) }}>Change Count - {count}</button>
      <input type="text" name="" id="" onChange={handleChange} />
      <ul>
        {filteredItems.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

export default React.memo(ExampleComponent)
