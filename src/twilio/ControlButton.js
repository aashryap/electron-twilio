export const ControlButton = ({
    icon,
    onClick,
    label,
    className
}) => {
    return (
        <div className="hover:text-blue-500 cursor-pointer" onClick={onClick} >
            <div className={`inline-block rounded-full shadow-md hover:shadow-sm bg-white h-10 w-10 flex items-center justify-center text-sm ${className} mb-2`}>
                <span className={`fas ${icon}`}/>
            </div>
            <div className="text-center text-sm font-medium">{label}</div>
        </div>
    )
}