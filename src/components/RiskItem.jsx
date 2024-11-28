
export default function RiskItem({icon: Icon, name, value}) {
    return (
        <div className="flex gap-3 items-center border-2 border-gray-300 shadow bg-gray-800 px-5 rounded py-5">
            <div className="text-3xl font-bold text-sky-400"><Icon /></div>
            <div className="flex flex-col gap-1">
                <div className="text-gray-300 font-semibold text-2xl">{name}</div>
                <div className="font-bold text-gray-100 text-xl">{value}</div>
            </div>
        </div>
    )
}