import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faArrowsSpin,
  faGear,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress
} from "@fortawesome/free-solid-svg-icons";
import dingSound from "./resources/ding.mp3";
import startSound from "./resources/start.mp3";
import finishSound from "./resources/finish.mp3";
import { Helmet } from "react-helmet";

function TabataTimer() {
  const [currentTime, setCurrentTime] = useState(20);
  const [countdownTime, setCountdownTime] = useState(10);
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tabataCycles, setTabataCycles] = useState(1);
  const [currentTabataCycle, setCurrentTabataCycle] = useState(1);
  const [tempTabataCycles, setTempTabataCycles] = useState(1);
  const [initialCountdownPlayed, setInitialCountdownPlayed] = useState(false);

  const ding = new Audio(dingSound);
  const start = new Audio(startSound);
  const finish = new Audio(finishSound);

  useEffect(() => {
    let interval;

    if (isCountdownActive) {
      interval = setInterval(() => {
        if (countdownTime > 0) {
          setCountdownTime((prevTime) => prevTime - 1);
          if (countdownTime <= 3 && soundEnabled) ding.play();
        } else {
          setInitialCountdownPlayed(true);
          setIsCountdownActive(false);
          setIsActive(true);
          setCountdownTime(10);
        }
      }, 1000);
    } else if (isActive) {
      interval = setInterval(() => {
        if (currentTime > 0) {
          setCurrentTime((prevTime) => prevTime - 1);
          if (currentTime <= 3 && soundEnabled) {
            ding.play();
          }
        } else {
          if (currentCycle === totalCycles) {
            if (isResting) {
              if (currentTabataCycle < tabataCycles) {
                setCurrentCycle(1);
                setIsResting(false);
                setCurrentTime(workTime);
                setCurrentTabataCycle((prevCycle) => prevCycle + 1);
              } else {
                setIsActive(false);
              }
            } else {
              if (currentTabataCycle < tabataCycles) {
                if (soundEnabled) start.play();
                setIsResting(true);
                setCurrentTime(restTime);
              } else {
                setIsActive(false);
                if (soundEnabled) finish.play();
              }
            }
          } else if (isResting) {
            if (soundEnabled) start.play();
            setCurrentCycle((prevCycle) => prevCycle + 1);
            setIsResting(false);
            setCurrentTime(workTime);
          } else {
            if (soundEnabled) start.play();
            setIsResting(true);
            setCurrentTime(restTime);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    isCountdownActive,
    countdownTime,
    currentTime,
    currentCycle,
    isResting,
    workTime,
    restTime,
    totalCycles,
    soundEnabled,
    tabataCycles,
    currentTabataCycle,
  ]);

  function startTimer() {
        // Asegurarse de que la interacción del usuario inicie el audio
        start.play().catch(e => console.log("No se pudo reproducir el audio inicialmente"));
    
    if (!initialCountdownPlayed) {
      setIsCountdownActive(true);
    } else {
      setIsActive(true);
    }
    if (isConfigOpen) {
      toggleConfig();
    }
  }

  function pauseTimer() {
    setIsCountdownActive(false);
    setIsActive(false);
  }

  function resetTimer() {
    setIsCountdownActive(false);
    setIsActive(false);
    setCurrentTime(workTime);
    setCurrentCycle(1);
    setIsResting(false);
    setCurrentTabataCycle(1);
    setInitialCountdownPlayed(false);
  }

  function toggleConfig() {
    if (isConfigOpen) {
      setWorkTime(tempWorkTime);
      setRestTime(tempRestTime);
      setTotalCycles(tempTotalCycles);
      setCurrentTime(tempWorkTime);
      setTabataCycles(tempTabataCycles);
    }
    setIsConfigOpen(!isConfigOpen);
  }

  function cancelConfig() {
    setIsConfigOpen(!isConfigOpen);
  }

  function ProgressBar({
    children,
    currentTime,
    totalTime,
    isResting,
    isCountdown,
  }) {
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

  function Timer({ time, isResting, cycle, totalCycles }) {
    return (
      <div className="timer">
        <h2 className={isResting ? "resting" : "working"}>
          {isResting ? "Descanso" : "Ejercicio"}
        </h2>
        <h2>
          {cycle} de {totalCycles}
        </h2>
        <p className="segs">{time} </p>
      </div>
    );
  }

  function Controls({ isActive, start, pause, reset }) {
    return (
      <div className="controls">
        {!isActive ? (
          <button className="start-button" onClick={start}>
            <FontAwesomeIcon className="textIcon" icon={faPlay} /> Iniciar
          </button>
        ) : (
          <button className="btnPause" onClick={pause}>
            Pausar
          </button>
        )}
        <button className="reset-button" onClick={reset}>
          <FontAwesomeIcon className="textIcon" icon={faArrowsSpin} />
          Reiniciar
        </button>
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
    soundEnabled,
    setSoundEnabled,
    tabataCycles,
    setTabataCycles,
    toggleConfig,
  }) {
    return (
      <div className="config-container">
        <label className="lbl">
          Ejercicio
          <input
            className="inputConfig"
            type="number"
            defaultValue={workTime}
            onBlur={(e) => setWorkTime(Number(e.target.value))}
          />
        </label>
        <label className="lbl">
          Descanso
          <input
            className="inputConfig"
            type="number"
            defaultValue={restTime}
            onBlur={(e) => setRestTime(Number(e.target.value))}
          />
        </label>
        <label className="lbl">
          Rondas
          <input
            className="inputConfig"
            type="number"
            defaultValue={totalCycles}
            onBlur={(e) => setTotalCycles(Number(e.target.value))}
          />
        </label>
        <label className="lbl">
          Ciclos Tabata
          <input
            className="inputConfig"
            type="number"
            defaultValue={tabataCycles}
            onBlur={(e) => setTabataCycles(Number(e.target.value))}
          />
        </label>
        <button
          className="soundBtn"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          <FontAwesomeIcon
            className="textIcon"
            icon={soundEnabled ? faVolumeUp : faVolumeMute}
          />
          {soundEnabled ? "Desactivar Sonido" : "Activar Sonido"}
        </button>
        <button className="configBtn" onClick={toggleConfig}>
          <FontAwesomeIcon className="textIcon" icon={faGear} />
          Empezar
        </button>
        <button className="configBtn" onClick={cancelConfig}>
          Cancelar
        </button>
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
        {isFullScreen ? <FontAwesomeIcon icon={faCompress} style={{color: "#f5faff",}} /> : <FontAwesomeIcon icon={faExpand} style={{color: "#f0f5ff",}} />}
      </div>
    );
  }

  function AmazonBanner() {
    return (
      <div className="amazon-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h3>Equipamiento Fitness</h3>
            <p>Productos recomendados para tu entrenamiento</p>
          </div>
          <div className="banner-products">
            <a 
              href="https://www.amazon.es/s?k=colchoneta+fitness&__mk_es_ES=%C3%85M%C3%85Z%C3%95N&crid=2V8XZ8KQZ8KQZ&sprefix=colchoneta+fitness%2Caps%2C89&ref=nb_sb_noss_2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="product-link"
            >
              <div className="product-item">
                <span className="product-icon">🧘‍♀️</span>
                <span className="product-name">Colchonetas</span>
              </div>
            </a>
            <a 
              href="https://www.amazon.es/s?k=pesas+mano&__mk_es_ES=%C3%85M%C3%85Z%C3%95N&crid=2V8XZ8KQZ8KQZ&sprefix=pesas+mano%2Caps%2C89&ref=nb_sb_noss_2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="product-link"
            >
              <div className="product-item">
                <span className="product-icon">💪</span>
                <span className="product-name">Pesas</span>
              </div>
            </a>
            <a 
              href="https://www.amazon.es/s?k=ropa+deportiva&__mk_es_ES=%C3%85M%C3%85Z%C3%95N&crid=2V8XZ8KQZ8KQZ&sprefix=ropa+deportiva%2Caps%2C89&ref=nb_sb_noss_2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="product-link"
            >
              <div className="product-item">
                <span className="product-icon">👕</span>
                <span className="product-name">Ropa</span>
              </div>
            </a>
          </div>
          <div className="banner-footer">
            <span className="amazon-logo">Amazon</span>
            <span className="affiliate-text">enlaces afiliados</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProgressBar
      currentTime={isCountdownActive ? countdownTime : currentTime}
      totalTime={isCountdownActive ? 10 : isResting ? restTime : workTime}
      isResting={isResting}
      isCountdown={isCountdownActive}
    >
      <div>
        <Helmet>
          <title>Timer Tabata</title>
          <meta
            name="description"
            content="Timer Tabata"
          />
          <meta name="keywords" content="Tabata, Crossfit, deporte, ejercicio, cronómetro tabata, temporizador tabata, timer tabata" />
          <meta name="author" content="Alejandro Rodríguez" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            property="og:title"
            content="Timer Tabata"
          />
          <meta
            property="og:description"
            content="Timer Tabata"
          />
        </Helmet>
      </div>

      <AmazonBanner />

      <Timer
        time={currentTime}
        isResting={isResting}
        cycle={currentCycle}
        totalCycles={totalCycles}
      />
      <Controls
        isActive={isActive || isCountdownActive}
        start={startTimer}
        pause={pauseTimer}
        reset={resetTimer}
      />
      {!isConfigOpen && (
        <button className="configBtn" onClick={toggleConfig}>
          <FontAwesomeIcon className="textIcon" icon={faGear} />
          Configurar
        </button>
      )}
      {isConfigOpen && (
        <ConfigPanel
          workTime={tempWorkTime}
          setWorkTime={setTempWorkTime}
          restTime={tempRestTime}
          setRestTime={setTempRestTime}
          totalCycles={tempTotalCycles}
          setTotalCycles={setTempTotalCycles}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          tabataCycles={tempTabataCycles}
          setTabataCycles={setTempTabataCycles}
          toggleConfig={toggleConfig}
        />
      )}
      <FullScreenToggle />
    </ProgressBar>
  );
}

export default TabataTimer;
