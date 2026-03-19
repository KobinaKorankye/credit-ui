import numeral from 'numeral';
import Card from './Card';
import { LuCoins, LuScale } from 'react-icons/lu';


export default function SummaryCard({ title, viewBtnClassName, volume, value, className, onViewClick }) {

    return (
        <Card
            viewBtnClassName={viewBtnClassName}
            showView={true}
            onViewClick={onViewClick}
            className={className}
            title={title}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="text-primary">
                            <LuScale />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">Volume</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{volume}</div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="text-accent">
                            <LuCoins />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">Value</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                        GH₵{numeral(value).format('0,0.00')}
                    </div>
                </div>
            </div>
        </Card>
    );
}
