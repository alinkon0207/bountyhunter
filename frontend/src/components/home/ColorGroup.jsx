const LIST = ['#FFFF67', '#3FFFFF', '#52DC4B', '#FF6E3D', '#3D45FF'];

const ColorGroup = () => (
    <div className='flex'>
        {LIST.map((color, id) => (
            <div className={`w-4 h-4`} key={id} style={{ backgroundColor: color }}>
            </div>
        ))}
    </div>
)

export default ColorGroup;
