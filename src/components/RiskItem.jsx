
import Card from "./Card";

export default function RiskItem({icon: Icon, name, value}) {
    return (
        <Card className="h-full">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="text-sm font-medium text-muted-foreground truncate">{name}</div>
                    <div className="text-xl lg:text-2xl font-bold text-foreground">{value}</div>
                </div>
            </div>
        </Card>
    )
}