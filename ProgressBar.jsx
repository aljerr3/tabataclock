function ProgressBar({ currentTime, totalTime, isResting }) {
    const percentage = (currentTime / totalTime) * 100;

    return (
        <div className="progressbar-container">
            <div 
                className={`progressbar-fill ${isResting ? 'resting' : 'working'}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}