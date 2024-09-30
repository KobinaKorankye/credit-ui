import numeral from 'numeral';

const borderColors = [
    `border-secondary`, `border-primary`
]

export default function CurrencyLegend(data) {
    
    return (
        <div className='flex justify-between items-center text-gray-600' key={data.name}>
            <div className='flex gap-1 items-center'>
                <div className={`border-2 ${borderColors[data.index]} w-2 h-2 rounded-full`} />
                <div className='text-[0.77rem] font-[500]'>{data.name}</div>
            </div>
            <div className='text-[0.85rem] font-[600]'>GH₵{numeral(data.value).format("0,0.00")}</div>
        </div>
    )
}