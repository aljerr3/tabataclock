import React, { useState, useEffect } from "react";

function TabataTimer() {
  const [currentTime, setCurrentTime] = useState(20); // Tiempo inicial de trabajo
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempWorkTime, setTempWorkTime] = useState(20);
  const [tempRestTime, setTempRestTime] = useState(10);
  const [tempTotalCycles, setTempTotalCycles] = useState(8);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [totalCycles, setTotalCycles] = useState(8);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (currentTime > 0) {
          setCurrentTime((prevTime) => prevTime - 1);
        } else {
          if (currentCycle === totalCycles && isResting) {
            setIsActive(false);
            setCurrentCycle(1);
            setIsResting(false);
            setCurrentTime(workTime);
          } else if (isResting) {
            setCurrentCycle((prevCycle) => prevCycle + 1);
            setIsResting(false);
            setCurrentTime(workTime);
          } else {
            setIsResting(true);
            setCurrentTime(restTime);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    currentTime,
    currentCycle,
    isResting,
    workTime,
    restTime,
    totalCycles,
  ]);

  function toggleConfig() {
    if (isConfigOpen) {
      setWorkTime(tempWorkTime);
      setRestTime(tempRestTime);
      setTotalCycles(tempTotalCycles);
      setCurrentTime(tempWorkTime);
    }
    setIsConfigOpen(!isConfigOpen);
  }

  function FullScreenToggle() {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullScreen(false);
        }
      }
    };

    return (
      <div className="fullscreen-icon" onClick={toggleFullScreen}>
        {isFullScreen ? "🔳" : "🔲"}
      </div>
    );
  }

  return (
    <ProgressBar
      currentTime={currentTime}
      totalTime={isResting ? restTime : workTime}
      isResting={isResting}
    >
      <Timer
        time={currentTime}
        isResting={isResting}
        cycle={currentCycle}
        totalCycles={totalCycles}
      />

      <Controls
        isActive={isActive}
        start={() => setIsActive(true)}
        pause={() => setIsActive(false)}
        reset={() => {
          setIsActive(false);
          setCurrentTime(workTime);
          setCurrentCycle(1);
          setIsResting(false);
        }}
      />
      <button className="configBtn" onClick={toggleConfig}>
        {isConfigOpen ? "Guardar" : "Configurar"}
      </button>
      {isConfigOpen && (
        <ConfigPanel
          workTime={tempWorkTime}
          setWorkTime={setTempWorkTime}
          restTime={tempRestTime}
          setRestTime={setTempRestTime}
          totalCycles={tempTotalCycles}
          setTotalCycles={setTempTotalCycles}
        />
      )}

      <FullScreenToggle />
    </ProgressBar>
  );
}

function Timer({ time, isResting, cycle, totalCycles }) {
  return (
    <div className="timer">
      <h1 className={isResting ? "resting" : "working"}>
        {isResting ? "Descanso" : "Ejercicio"}
      </h1>
      <p>
        Ciclo {cycle} de {totalCycles}
      </p>
      <p className="segs">{time} </p>
    </div>
  );
}

function Controls({ isActive, start, pause, reset }) {
  return (
    <div className="controls">
      {!isActive ? (
        <button className="start-button" onClick={start}>
          Iniciar
        </button>
      ) : (
        <button onClick={pause}>Pausar</button>
      )}
      <button className="reset-button" onClick={reset}>
        Reiniciar
      </button>
    </div>
  );
}

function ProgressBar({ children, currentTime, totalTime, isResting }) {
  const percentage = (currentTime / totalTime) * 100;

  return (
    <div className="tabata-container">
      <div
        className={`progressbar-background ${
          isResting ? "resting" : "working"
        }`}
        style={{ width: `${percentage}%` }}
      />
      <div className="tabata-content">{children}</div>
    </div>
  );
}

function ConfigPanel({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
  totalCycles,
  setTotalCycles,
}) {
  return (
    <div className="config-container">
      <label>
        Tiempo de trabajo:
        <input
          type="number"
          value={workTime}
          onChange={(e) => setWorkTime(Number(e.target.value))}
        />
      </label>
      <label>
        Tiempo de descanso:
        <input
          type="number"
          value={restTime}
          onChange={(e) => setRestTime(Number(e.target.value))}
        />
      </label>
      <label>
        Ciclos totales:
        <input
          type="number"
          value={totalCycles}
          onChange={(e) => setTotalCycles(Number(e.target.value))}
        />
      </label>
    </div>
  );
}

export default TabataTimer;
