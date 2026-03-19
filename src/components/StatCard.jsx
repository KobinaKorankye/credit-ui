import Card from './Card';


export default function StatCard({ title, statClassName, titleClassName, stat, alt, className, noColor, option = 1, icon: Icon }) {
    const getColorClasses = () => {
        if (noColor) return '';

        if (alt) {
            return option === 1
                ? 'bg-primary/10 border-primary/20 text-primary'
                : 'bg-accent/10 border-accent/20 text-accent';
        }
        return 'bg-secondary/10 border-secondary/20 text-secondary';
    };

    const getStatColor = () => {
        if (noColor) return 'text-foreground';

        if (alt) {
            return option === 1 ? 'text-primary' : 'text-accent';
        }
        return 'text-secondary';
    };

    return (
        <Card
            className={className}
            containerClassName={`${getColorClasses()}`}
            titleClassName={titleClassName || 'text-card-foreground'}
            title={title}
        >
            <div className="flex items-center justify-between">
                <div className={`text-2xl sm:text-3xl font-bold ${statClassName || getStatColor()}`}>
                    {stat}
                </div>
                <div className="text-4xl sm:text-6xl text-muted-foreground/30">
                    <Icon />
                </div>
            </div>
        </Card>
    );
}
