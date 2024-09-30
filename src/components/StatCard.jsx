import numeral from 'numeral';
import Card from './Card';
import { LuCoins, LuScale, LuScale3D } from 'react-icons/lu';
import { FaMoneyBill } from 'react-icons/fa';
import ViewButton from "./ViewButton";


export default function StatCard({ title, statClassName, titleClassName, stat, alt, className, noColor, option = 1, icon: Icon }) {

    return (
        <Card className={className}
            containerClassName={`border ${noColor ? '' : (alt ? (option === 1 ? 'bg-primary/15 border-primary/70' : 'bg-accent/15 border-accent/70') : 'bg-secondary/15 border-secondary/70')}`}
            titleClassName={`${titleClassName ? titleClassName : 'text-gray-700'} uppercase`}
            title={title}>
            <div className="flex-1 flex items-center justify-between">
                <div className={`${statClassName? statClassName: `text-2xl ${noColor ? '' : (alt ? (option === 1 ? 'text-primary' : 'text-accent') : 'text-secondary')}`}`}>{stat}</div>
                <div className={`text-7xl text-gray-400`}> <Icon /> </div>
            </div>
        </Card>
    );
}
