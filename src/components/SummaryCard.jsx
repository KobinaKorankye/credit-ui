import numeral from 'numeral';
import Card from './Card';
import { LuCoins, LuScale, LuScale3D } from 'react-icons/lu';
import { FaMoneyBill } from 'react-icons/fa';
import ViewButton from "./ViewButton";


export default function SummaryCard({ title, viewBtnClassName, volume, value, className, onViewClick }) {

    return (
        <Card viewBtnClassName={viewBtnClassName} showView onViewClick={onViewClick} className={className} title={title}>
            <div className="flex justify-between items-center mt-8">
                <div className="flex items-end">
                    <div className='text-primary'><LuScale /></div>
                    <div className="text-[0.77rem] text-gray-600 font-[500] ml-2">Volume</div>
                </div>

                <div className="text-surface-light text-[0.85rem] font-[600]">{volume}</div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-end">
                    <div className='text-accent/60'><LuCoins /></div>
                    <div className="text-gray-600 text-[0.77rem] font-[500] ml-2">Value</div>
                </div>

                <div className="text-surface-light text-[0.9rem] font-[600]">GH₵{numeral(value).format('0,0.00')}</div>
            </div>
        </Card>
    );
}
