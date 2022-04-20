const StakeTabLink = (data:{minDays:number}) => {
    return (
        <li className="StakeTablinks" id="defaultOpen">
            <button> {data.minDays} Days</button>
        </li>
    )
}

export default StakeTabLink;