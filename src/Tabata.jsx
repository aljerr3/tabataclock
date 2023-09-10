import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import dingSound from "./resources/ding.mp3";
import startSound from "./resources/start.mp3";


function TabataTimer() {
  const [currentTime, setCurrentTime] = useState(20);
  const [countdownTime, setCountdownTime] = useState(3);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempWorkTime, setTempWorkTime] = useState(20);
  const [tempRestTime, setTempRestTime] = useState(10);
  const [tempTotalCycles, setTempTotalCycles] = useState(8);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [totalCycles, setTotalCycles] = useState(8);
  const ding = new Audio(dingSound);
  const start = new Audio(startSound);


  useEffect(() => {
    let interval;

    if (isCountdownActive) {
      interval = setInterval(() => {
        if (countdownTime > 0) {
          setCountdownTime(prevTime => prevTime - 1);
          start.play();  // Reproduce el sonido

        } else {
          setIsCountdownActive(false);
          setIsActive(true);
          setCountdownTime(3);
        }
      }, 1000);
    } else if (isActive) {
      interval = setInterval(() => {
        if (currentTime > 0) {
          setCurrentTime(prevTime => prevTime - 1);
        } else {
          if (currentCycle === totalCycles && isResting) {
            setIsActive(false);
            ding.play();
            setCurrentCycle(1);
            setIsResting(false);
            setCurrentTime(workTime);
          } else if (isResting) {
            setCurrentCycle(prevCycle => prevCycle + 1);
            ding.play();  // Reproduce el sonido
            setIsResting(false);
            setCurrentTime(workTime);
          } else {
            setIsResting(true);
            setCurrentTime(restTime);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isCountdownActive, countdownTime, currentTime, currentCycle, isResting, workTime, restTime, totalCycles]);

  function startTimer() {
    setIsCountdownActive(true);
    setIsActive(false);
  }

  function toggleConfig() {
    if (isConfigOpen) {
      setWorkTime(tempWorkTime);
      setRestTime(tempRestTime);
      setTotalCycles(tempTotalCycles);
      setCurrentTime(tempWorkTime);
    }
    setIsConfigOpen(!isConfigOpen);
  }

  function ProgressBar({ children, currentTime, totalTime, isResting, isCountdown }) {
    const percentage = 100 - (currentTime / totalTime) * 100;
    const progressBarClass = isCountdown 
      ? "countdown" 
      : isResting 
      ? "resting" 
      : "working";

    return (
      <div className="tabata-container">
        <div
          className={`progressbar-background ${progressBarClass}`}
          style={{ width: `${percentage}%` }}
        />
        <div className="tabata-content">{children}</div>
      </div>
    );
  }

  return (
    <ProgressBar
      currentTime={isCountdownActive ? countdownTime : currentTime}
      totalTime={isCountdownActive ? 3 : (isResting ? restTime : workTime)}
      isResting={isResting}
      isCountdown={isCountdownActive}
    >
      <Timer
        time={currentTime}
        isResting={isResting}
        cycle={currentCycle}
        totalCycles={totalCycles}
      />

      <Controls
        isActive={isActive}
        start={startTimer}
        pause={() => setIsActive(false)}
        reset={() => {
          setIsActive(false);
          setCurrentTime(workTime);
          setCurrentCycle(1);
          setIsResting(false);
        }}
      />
      <button className="configBtn" onClick={toggleConfig}>
        
        <FontAwesomeIcon icon={faGear} />
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
        {cycle} de {totalCycles}
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
          <FontAwesomeIcon icon={faPlay} />  Iniciar
        </button>
      ) : (
        <button className="btnPause" onClick={pause}>
          Pausar
        </button>
      )}
      <button className="reset-button" onClick={reset}>
        <FontAwesomeIcon icon={faArrowsSpin} /> 
        Reiniciar
        
      </button>
      
    </div>
  );
}

function ConfigPanel({ workTime, setWorkTime, restTime, setRestTime, totalCycles, setTotalCycles }) {
  return (
    <div className="config-container">
      <label className="lbl">
        Ejercicio:
        <input
          type="number"
          value={workTime}
          onChange={(e) => setWorkTime(Number(e.target.value))}
        />
      </label>
      <label className="lbl">        
      Descanso:
        <input
          type="number"
          value={restTime}
          onChange={(e) => setRestTime(Number(e.target.value))}
        />
      </label>
      <label className="lbl">        
      Ciclos:
        <input
          type="number"
          value={totalCycles}
          onChange={(e) => setTotalCycles(Number(e.target.value))}
        />
      </label>
    </div>
  );
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
      {isFullScreen ? "✖️" : "➕"}
    </div>
  );
}

export default TabataTimer;
