
export default function RiskItem({icon: Icon, name, value}) {
    return (
        <div className="flex gap-3 items-center border-2 border-gray-300 px-5 rounded py-2">
            <div className="text-3xl font-bold text-primary"><Icon /></div>
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 font-semibold text-2xl">{name}</div>
                <div className="font-bold text-xl">{value}</div>
            </div>
        </div>
    )
}