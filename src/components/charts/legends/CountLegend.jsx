import numeral from 'numeral';

export default function CountLegend(data) {
    return (
        <div className='flex justify-between items-center text-muted-foreground' key={data.name}>
            <div className='flex gap-2 items-center'>
                <div
                    className='w-3 h-3 rounded-full border-2 border-background'
                    style={{ backgroundColor: data.color }}
                />
                <div className='text-xs font-medium text-foreground'>{data.name}</div>
            </div>
            <div className='text-sm font-semibold text-foreground'>{numeral(data.value).format("0,0")}</div>
        </div>
    )
}