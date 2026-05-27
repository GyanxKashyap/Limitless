// Grab the elements we need from the HTML.
const webcamVideo = document.getElementById("webcam");
const landmarkCanvas = document.getElementById("landmarkCanvas");
const canvasContext = landmarkCanvas.getContext("2d");
const domainStage = document.getElementById("domainStage");
const domainBackdrop = document.getElementById("domainBackdrop");
const activationText = document.getElementById("activationText");
const activationSubtext = document.getElementById("activationSubtext");
const activationMeter = document.getElementById("activationMeter");
const activationProgressFill = document.getElementById("activationProgressFill");
const stageStateText = document.getElementById("stageStateText");
const cameraStatusText = document.getElementById("cameraStatusText");
const cameraStatusDot = document.getElementById("cameraStatusDot");
const handStatusText = document.getElementById("handStatusText");
const handStatusDot = document.getElementById("handStatusDot");
const microphoneStatusText = document.getElementById("microphoneStatusText");
const microphoneStatusDot = document.getElementById("microphoneStatusDot");
const fingerStatusText = document.getElementById("fingerStatusText");
const fingerStatusDot = document.getElementById("fingerStatusDot");
const gestureStatusText = document.getElementById("gestureStatusText");
const gestureStatusDot = document.getElementById("gestureStatusDot");
const voiceStatusText = document.getElementById("voiceStatusText");
const voiceStatusDot = document.getElementById("voiceStatusDot");
const domainStatusText = document.getElementById("domainStatusText");
const domainStatusDot = document.getElementById("domainStatusDot");
const domainStateText = document.getElementById("domainStateText");
const domainStateDot = document.getElementById("domainStateDot");
const techniqueStatusText = document.getElementById("techniqueStatusText");
const techniqueStatusDot = document.getElementById("techniqueStatusDot");
const summonStatusText = document.getElementById("summonStatusText");
const summonStatusDot = document.getElementById("summonStatusDot");
const emptyState = document.getElementById("emptyState");
const operatorGate = document.getElementById("operatorGate");
const operatorGateForm = document.getElementById("operatorGateForm");
const operatorNameInput = document.getElementById("operatorNameInput");
const operatorDisplayName = document.getElementById("operatorDisplayName");
const welcomeToast = document.getElementById("welcomeToast");
const startSystemButton = document.getElementById("startSystemButton");
const commandGuideButton = document.getElementById("commandGuideButton");
const commandGuideModal = document.getElementById("commandGuideModal");
const commandGuideClose = document.getElementById("commandGuideClose");
const summonMahoragaButton = document.getElementById("summonMahoragaButton");
const techniqueLayer = document.getElementById("techniqueLayer");
const summonLayer = document.getElementById("summonLayer");
const mahoragaCanvas = document.getElementById("mahoragaCanvas");
const unlimitedVoidCanvas = document.getElementById("unlimitedVoidCanvas");
const domainModelLayer = document.getElementById("domainModelLayer");
const domainModelCanvas = document.getElementById("domainModelCanvas");
const shrineFallback = document.getElementById("shrineFallback");
const fpsReadout = document.getElementById("fpsReadout");
const qualityReadout = document.getElementById("qualityReadout");
const heavyFxReadout = document.getElementById("heavyFxReadout");
const idleReadout = document.getElementById("idleReadout");
const systemVoiceReadout = document.getElementById("systemVoiceReadout");
const systemStateReadout = document.getElementById("systemStateReadout");
const systemDomainReadout = document.getElementById("systemDomainReadout");
const systemSummonReadout = document.getElementById("systemSummonReadout");
const systemGestureReadout = document.getElementById("systemGestureReadout");
const systemTrackingReadout = document.getElementById("systemTrackingReadout");
const systemRendererReadout = document.getElementById("systemRendererReadout");
const systemLastCommandReadout = document.getElementById("systemLastCommandReadout");
const systemTechniqueReadout = document.getElementById("systemTechniqueReadout");

let handsModel;
let isHandModelReady = false;
let isProcessingFrame = false;
let gestureHistory = [];
let currentStableGesture = "No Gesture";
let speechRecognition;
let shouldKeepListening = false;
let isSpeechRecognitionActive = false;
let speechRestartTimer;
let lastVoiceMatchTime = 0;
let lastVoiceCommandKey = "";
let lastCommandLabel = "None";
let activeDomainKey = "default";
let activeDomainGesture = "No Gesture";
let isDomainModeActive = false;
let isActivationSequenceRunning = false;
let lastDomainActivationTime = 0;
let activationSequenceTimer;
let activationStepTimers = [];
let audioContext;
let buildupAudioNodes = [];
let ambienceAudioNodes = [];
let summonAudioNodes = [];
let invocationAudio;
let systemStarted = false;
let latestHandAnalyses = [];
let isMahoragaSummoning = false;
let isMahoragaPreparing = false;
let mahoragaTimers = [];
let activeTechniques = {
  blue: false,
  red: false,
  purple: false
};
let mahoragaRenderer;
let mahoragaScene;
let mahoragaCamera;
let mahoragaRoot;
let mahoragaEyes;
let mahoragaModelPromise;
let mahoragaAnimationId;
let isMahoragaRendererRunning = false;
let mahoragaClockStart = 0;
let mahoragaModelLoaded = false;
let mahoragaModelLoadFailed = false;
let mahoragaLastRenderTime = 0;
let mahoragaNeedsResize = true;
let domainModelRenderer;
let domainModelScene;
let domainModelCamera;
let domainModelRoot;
let domainModelPromise;
let domainModelAnimationId;
let isDomainModelRendererRunning = false;
let domainModelClockStart = 0;
let domainModelLastRenderTime = 0;
let domainModelNeedsResize = true;
let activeDomainModelKey = "";
let unlimitedVoidRenderer;
let unlimitedVoidScene;
let unlimitedVoidCamera;
let unlimitedVoidRoot;
let unlimitedVoidStars;
let unlimitedVoidRings = [];
let unlimitedVoidAnimationId;
let isUnlimitedVoidRunning = false;
let unlimitedVoidClockStart = 0;
let unlimitedVoidLastRenderTime = 0;
let unlimitedVoidNeedsResize = true;
let handTrackingAnimationId;
let lastHandTrackingTime = 0;
let isHandTrackingSuspendedForIdle = false;
let purpleChargeTimer;
let performanceAnimationId;
let performanceLastSampleTime = 0;
let performanceFrameCount = 0;
let currentFps = 0;
let lastUserActivityTime = Date.now();
let currentQualityLevel = "";
let currentHandTrackingIntervalMs;
let mahoragaFrameIntervalMs;
let lastGuideFocus;
let welcomeToastTimer;

// MediaPipe gives every hand 21 landmarks.
// These pairs describe which landmarks should be connected by lines.
const HAND_CONNECTIONS_FALLBACK = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

const GESTURES = {
  NO_GESTURE: "No Gesture",
  FIST: "Fist",
  PEACE_SIGN: "Peace Sign",
  UNKNOWN: "Unknown"
};

const GESTURE_HISTORY_SIZE = 8;
const GESTURE_MIN_MATCHES = 5;
const DOMAIN_COOLDOWN_MS = 2500;
const ACTIVATION_SEQUENCE_MS = 4000;
const VOICE_MATCH_COOLDOWN_MS = 900;
const DEFAULT_AUDIO_FLASH_DELAY_MS = 19000;
const FORMING_CLASSES = ["domain-forming", "shrine-forming"];
const THEME_CLASSES = ["theme-gojo", "theme-sukuna", "theme-mahoraga", "theme-purple"];
const MOMENTARY_VFX_CLASSES = ["screen-shake", "energy-burst"];
const VOID_SEQUENCE_CLASSES = [
  "void-silence",
  "void-expansion",
  "void-distorting",
  "void-tearing",
  "void-limitless",
  "void-observing",
  "void-knowledge",
  "void-opening",
  "void-active"
];
const MAHORAGA_MODEL_URL = "assets/mahoraga_summon.glb";
const SHRINE_MODEL_URL = "assets/domain_shrine.glb";
const MAHORAGA_TARGET_FPS = 30;
const HAND_TRACKING_TARGET_FPS = 24;
const COMMAND_COOLDOWN_MS = 900;
const HEAVY_EFFECT_COOLDOWN_MS = 2400;
const IDLE_OPTIMIZATION_MS = 10000;
const UNLIMITED_VOID_TARGET_FPS = 30;
const UNLIMITED_VOID_SEQUENCE_MS = 7600;

mahoragaFrameIntervalMs = 1000 / MAHORAGA_TARGET_FPS;
currentHandTrackingIntervalMs = 1000 / HAND_TRACKING_TARGET_FPS;

const EFFECT_PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
};

const QUALITY_PROFILES = {
  full: {
    handFps: 24,
    mahoragaFps: 30,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  },
  balanced: {
    handFps: 20,
    mahoragaFps: 24,
    modelComplexity: 1,
    minDetectionConfidence: 0.68,
    minTrackingConfidence: 0.68
  },
  low: {
    handFps: 16,
    mahoragaFps: 20,
    modelComplexity: 0,
    minDetectionConfidence: 0.65,
    minTrackingConfidence: 0.65
  },
  emergency: {
    handFps: 12,
    mahoragaFps: 15,
    modelComplexity: 0,
    minDetectionConfidence: 0.62,
    minTrackingConfidence: 0.62
  }
};

// Add future spoken commands here.
const VOICE_COMMANDS = {
  DOMAIN_EXPANSION: {
    phrase: "domain expansion",
    label: "Domain Expansion",
    aliases: ["domain expansion", "domain", "expansion"]
  },
  BLUE: {
    phrase: "blue",
    label: "Blue",
    technique: "blue",
    aliases: ["blue", "lapse blue", "curse blue"]
  },
  RED: {
    phrase: "red",
    label: "Red",
    technique: "red",
    aliases: ["red", "reversal red", "curse red"]
  },
  HOLLOW_PURPLE: {
    phrase: "hollow purple",
    label: "Hollow Purple",
    technique: "purple",
    aliases: ["hollow purple", "purple", "hollow"]
  },
  PURPLE: {
    phrase: "purple",
    label: "Purple",
    technique: "purple",
    aliases: ["purple"]
  },
  MAHORAGA: {
    phrase: "with this treasure i summon",
    label: "With This Treasure, I Summon",
    summon: "mahoraga",
    aliases: [
      "with this treasure i summon",
      "with this treasure",
      "i summon",
      "summon mahoraga",
      "mahoraga",
      "summon"
    ]
  },
  FUGA: {
    phrase: "fuga",
    label: "Fuga"
  },
  UNLIMITED_VOID: {
    phrase: "unlimited void",
    label: "Unlimited Void"
  }
};

// Add future domains here by mapping a gesture to a background class.
const DOMAIN_MAP = {
  [GESTURES.PEACE_SIGN]: {
    key: "domain-void",
    label: "Unlimited Void",
    className: "domain-void",
    audioSrc: "gojo_domain_expansion.mp3",
    formDuringAudio: true,
    lightweightVoid: true,
    audioFlashDelayMs: 450
  },
  [GESTURES.FIST]: {
    key: "domain-shrine",
    label: "Malevolent Shrine",
    className: "domain-shrine",
    audioSrc: "assets/malevolent_shrine.mp3",
    formDuringAudio: true,
    formingClass: "shrine-forming",
    formingStatus: "Status: Cursed Particles Rising",
    modelRevealDelayMs: 10800,
    audioFlashDelayMs: 15350
  }
};

const effectManager = {
  active: {
    background: null,
    summon: null,
    domain: null,
    particles: null,
    audio: null,
    shaders: null,
    postProcessing: null
  },
  commandTimes: new Map(),

  canRunCommand(commandName, cooldown = COMMAND_COOLDOWN_MS) {
    const now = Date.now();
    const lastRun = this.commandTimes.get(commandName) || 0;

    if (now - lastRun < cooldown) {
      return false;
    }

    this.commandTimes.set(commandName, now);
    return true;
  },

  start(category, effectName, options = {}) {
    const priority = options.priority || EFFECT_PRIORITY.LOW;
    const currentEffect = this.active[category];

    if (currentEffect && currentEffect.name === effectName) {
      currentEffect.startedAt = Date.now();
      return true;
    }

    if (currentEffect && currentEffect.priority > priority) {
      return false;
    }

    if (options.cleanup !== false) {
      this.stop(category, { immediate: options.immediate });
    }

    this.active[category] = {
      name: effectName,
      priority,
      startedAt: Date.now()
    };

    this.enforcePriorityBudget();
    return true;
  },

  stop(category, options = {}) {
    const currentEffect = this.active[category];

    if (!currentEffect) {
      return;
    }

    cleanupEffectCategory(category, options);
    this.active[category] = null;
    this.syncPriorityClass();
  },

  stopAll(options = {}) {
    Object.keys(this.active).forEach((category) => {
      this.stop(category, options);
    });
  },

  syncPriorityClass() {
    const hasHighPriorityEffect = Object.values(this.active).some((effect) => {
      return effect && effect.priority >= EFFECT_PRIORITY.HIGH;
    });

    document.body.classList.toggle("performance-heavy-active", hasHighPriorityEffect);
    updatePerformanceHud();
    return hasHighPriorityEffect;
  },

  enforcePriorityBudget() {
    const hasHighPriorityEffect = this.syncPriorityClass();

    if (!hasHighPriorityEffect) {
      return;
    }

    // Keep the cinematic center alive, but mute low-priority decorative work.
    this.stop("particles", { immediate: true });
    this.stop("shaders", { immediate: true });
    this.stop("postProcessing", { immediate: true });
  }
};

function hasHighPriorityEffect() {
  return Object.values(effectManager.active).some((effect) => {
    return effect && effect.priority >= EFFECT_PRIORITY.HIGH;
  });
}

function setCinematicActive(isActive) {
  document.body.classList.toggle("cinematic-active", isActive);
  updatePerformanceHud();
}

function enforceSingleHeavyRenderer(activeRenderer) {
  if (activeRenderer !== "void") {
    stopUnlimitedVoidRenderer();
  }

  if (activeRenderer !== "mahoraga") {
    stopMahoragaRenderLoop();
  }

  if (activeRenderer !== "domain-model") {
    stopDomainModelRenderLoop();
  }
}

// This function updates a small status indicator.
function updateStatus(textElement, dotElement, message, state) {
  textElement.textContent = message;
  dotElement.className = `status-dot ${state}`;
  updateSystemHud();
}

function updateCameraStatus(message, state) {
  updateStatus(cameraStatusText, cameraStatusDot, message, state);
}

function updateHandStatus(message, state) {
  updateStatus(handStatusText, handStatusDot, message, state);
}

function updateMicrophoneStatus(message, state) {
  updateStatus(microphoneStatusText, microphoneStatusDot, message, state);
}

function updateFingerStatus(count, state) {
  const label = count === 1 ? "Finger" : "Fingers";

  updateStatus(fingerStatusText, fingerStatusDot, `${label} Detected: ${count}`, state);
}

function updateGestureStatus(gesture, state) {
  updateStatus(gestureStatusText, gestureStatusDot, `Gesture: ${gesture}`, state);
}

function updateVoiceStatus(message, state) {
  updateStatus(voiceStatusText, voiceStatusDot, message, state);
}

function updateDomainStatus(message, state) {
  updateStatus(domainStatusText, domainStatusDot, message, state);
}

function updateDomainState(message, state) {
  updateStatus(domainStateText, domainStateDot, message, state);
}

function updateTechniqueStatus(message, state) {
  updateStatus(techniqueStatusText, techniqueStatusDot, message, state);
}

function updateSummonStatus(message, state) {
  updateStatus(summonStatusText, summonStatusDot, message, state);
}

function updateStageState(message) {
  stageStateText.textContent = message;
}

function stripStatusPrefix(text, prefix) {
  return String(text || "").replace(new RegExp(`^${prefix}:\\s*`, "i"), "").replace("✓", "").trim();
}

function getActiveRendererLabel() {
  if (isMahoragaRendererRunning) {
    return "Mahoraga";
  }

  if (isDomainModelRendererRunning) {
    return "Shrine";
  }

  if (isUnlimitedVoidRunning) {
    return "Unlimited Void";
  }

  return "None";
}

function getSystemStateLabel() {
  if (activeDomainKey !== "default") {
    return "Domain";
  }

  if (isMahoragaSummoning || summonLayer.classList.contains("mahoraga-active")) {
    return "Summon";
  }

  if (activeTechniques.purple || activeTechniques.blue || activeTechniques.red) {
    return "Technique";
  }

  return "Idle";
}

function getDomainLabel() {
  if (activeDomainKey === "domain-void") {
    return "Unlimited Void";
  }

  if (activeDomainKey === "domain-shrine") {
    return "Shrine";
  }

  return "None";
}

function getSummonLabel() {
  if (isMahoragaSummoning || isMahoragaPreparing || summonLayer.classList.contains("mahoraga-active")) {
    return "Mahoraga";
  }

  return "Inactive";
}

function getTechniqueLabel() {
  if (activeTechniques.purple) {
    return "Hollow Purple";
  }

  if (activeTechniques.blue && activeTechniques.red) {
    return "Blue + Red";
  }

  if (activeTechniques.blue) {
    return "Blue";
  }

  if (activeTechniques.red) {
    return "Red";
  }

  return stripStatusPrefix(techniqueStatusText?.textContent, "Technique") || "Standby";
}

function getTrackingLabel() {
  if (isHandTrackingSuspendedForIdle) {
    return "Paused";
  }

  if (handTrackingAnimationId) {
    return "Active";
  }

  if (isHandModelReady) {
    return "Ready";
  }

  return "Standby";
}

function updateSystemHud() {
  if (systemVoiceReadout) {
    systemVoiceReadout.textContent = stripStatusPrefix(voiceStatusText?.textContent, "Voice") || "Idle";
  }

  if (systemStateReadout) {
    systemStateReadout.textContent = getSystemStateLabel();
  }

  if (systemDomainReadout) {
    systemDomainReadout.textContent = getDomainLabel();
  }

  if (systemSummonReadout) {
    systemSummonReadout.textContent = getSummonLabel();
  }

  if (systemGestureReadout) {
    systemGestureReadout.textContent = currentStableGesture || GESTURES.NO_GESTURE;
  }

  if (systemTrackingReadout) {
    systemTrackingReadout.textContent = getTrackingLabel();
  }

  if (systemRendererReadout) {
    systemRendererReadout.textContent = getActiveRendererLabel();
  }

  if (systemLastCommandReadout) {
    systemLastCommandReadout.textContent = lastCommandLabel;
  }

  if (systemTechniqueReadout) {
    systemTechniqueReadout.textContent = getTechniqueLabel();
  }
}

function clearStageTheme() {
  THEME_CLASSES.forEach((className) => {
    domainStage.classList.remove(className);
  });
}

function setStageTheme(themeClass) {
  clearStageTheme();

  if (themeClass) {
    domainStage.classList.add(themeClass);
  }
}

function getDomainTheme(domain) {
  if (domain.key === "domain-void") {
    return "theme-gojo";
  }

  if (domain.key === "domain-shrine") {
    return "theme-sukuna";
  }

  return "";
}

function pulseStageEffect(className, duration = 760) {
  domainStage.classList.remove(className);
  void domainStage.offsetWidth;
  domainStage.classList.add(className);

  setTimeout(() => {
    domainStage.classList.remove(className);
  }, duration);
}

function runImpactVfx() {
  if (currentQualityLevel === "emergency") {
    return;
  }

  setCinematicActive(true);
  effectManager.start("particles", "impact-vfx", {
    priority: EFFECT_PRIORITY.LOW,
    cleanup: true,
    immediate: true
  });
  pulseStageEffect("energy-burst", 760);
  pulseStageEffect("screen-shake", 460);
}

function cleanupEffectCategory(category, options = {}) {
  if (category === "particles" || category === "shaders" || category === "postProcessing") {
    MOMENTARY_VFX_CLASSES.forEach((className) => domainStage.classList.remove(className));
    return;
  }

  if (category === "audio") {
    stopActivationSoundtrack();
    stopInvocationAudio();
    stopDomainAmbience();
    stopSummonAmbience();
    return;
  }

  if (category === "summon") {
    stopSummonEffect({
      animate: !options.immediate,
      reason: options.reason || "Summon: Standby"
    });
    return;
  }

  if (category === "domain") {
    clearActivationStepTimers();
    clearFormationState();
    disposeUnlimitedVoidRenderer();
    disposeDomainModelRenderer();
    stopInvocationAudio();
    stopActivationSoundtrack();
    stopDomainAmbience();
    domainStage.classList.remove("is-activating", "domain-switching", "domain-flash", "audio-reactive", "void-awakening");
    return;
  }

  if (category === "background") {
    domainBackdrop.className = "domain-backdrop";
    document.body.classList.remove("domain-active");
  }
}

function isFileProtocolMode() {
  return window.location.protocol === "file:";
}

function initUnlimitedVoidRenderer() {
  if (unlimitedVoidRenderer || !unlimitedVoidCanvas) {
    return Boolean(unlimitedVoidRenderer);
  }

  if (!window.THREE) {
    console.warn("Three.js is not available for Unlimited Void.");
    return false;
  }

  unlimitedVoidRenderer = new THREE.WebGLRenderer({
    canvas: unlimitedVoidCanvas,
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "low-power"
  });
  unlimitedVoidRenderer.setClearColor(0x000000, 0);
  unlimitedVoidRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  unlimitedVoidRenderer.shadowMap.enabled = false;
  unlimitedVoidRenderer.sortObjects = false;

  unlimitedVoidScene = new THREE.Scene();
  unlimitedVoidCamera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  unlimitedVoidCamera.position.z = 11;
  unlimitedVoidRoot = new THREE.Group();
  unlimitedVoidScene.add(unlimitedVoidRoot);

  const starCount = 260;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 8.5;
    const depth = -Math.random() * 10;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.62;
    positions[i * 3 + 2] = depth;
    colors[i * 3] = 0.6 + Math.random() * 0.4;
    colors[i * 3 + 1] = 0.82 + Math.random() * 0.18;
    colors[i * 3 + 2] = 1;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  unlimitedVoidStars = new THREE.Points(starGeometry, starMaterial);
  unlimitedVoidRoot.add(unlimitedVoidStars);

  unlimitedVoidRings = [];
  unlimitedVoidNeedsResize = true;
  return true;
}

function resizeUnlimitedVoidRenderer() {
  if (!unlimitedVoidRenderer || !unlimitedVoidCanvas || !unlimitedVoidCamera) {
    return;
  }

  const bounds = unlimitedVoidCanvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(bounds.width));
  const height = Math.max(1, Math.floor(bounds.height));
  const canvas = unlimitedVoidRenderer.domElement;

  if (!unlimitedVoidNeedsResize && canvas.width === width && canvas.height === height) {
    return;
  }

  unlimitedVoidRenderer.setSize(width, height, false);
  unlimitedVoidCamera.aspect = width / height;
  unlimitedVoidCamera.updateProjectionMatrix();
  unlimitedVoidNeedsResize = false;
}

function renderUnlimitedVoid(time) {
  if (!isUnlimitedVoidRunning || !unlimitedVoidRenderer || !unlimitedVoidScene || !unlimitedVoidCamera || !unlimitedVoidRoot) {
    return;
  }

  if (document.hidden || activeDomainKey !== "domain-void") {
    stopUnlimitedVoidRenderer();
    return;
  }

  if (time - unlimitedVoidLastRenderTime < 1000 / UNLIMITED_VOID_TARGET_FPS) {
    unlimitedVoidAnimationId = requestAnimationFrame(renderUnlimitedVoid);
    return;
  }

  unlimitedVoidLastRenderTime = time;
  const elapsed = (time - unlimitedVoidClockStart) * 0.001;
  const breath = 1 + Math.sin(elapsed * 0.42) * 0.025;

  unlimitedVoidRoot.scale.setScalar(breath);
  unlimitedVoidRoot.rotation.z = Math.sin(elapsed * 0.18) * 0.055;

  if (unlimitedVoidStars) {
    unlimitedVoidStars.rotation.z = elapsed * 0.012;
    unlimitedVoidStars.position.z = Math.sin(elapsed * 0.28) * 0.24;
  }

  resizeUnlimitedVoidRenderer();
  unlimitedVoidRenderer.render(unlimitedVoidScene, unlimitedVoidCamera);
  unlimitedVoidAnimationId = requestAnimationFrame(renderUnlimitedVoid);
}

function startUnlimitedVoidRenderer() {
  if (isUnlimitedVoidRunning) {
    return;
  }

  enforceSingleHeavyRenderer("void");

  if (!initUnlimitedVoidRenderer()) {
    return;
  }

  isUnlimitedVoidRunning = true;
  unlimitedVoidClockStart = performance.now();
  unlimitedVoidLastRenderTime = 0;
  unlimitedVoidAnimationId = requestAnimationFrame(renderUnlimitedVoid);
  updateSystemHud();
}

function shouldRenderUnlimitedVoid() {
  return false;
}

function stopUnlimitedVoidRenderer() {
  isUnlimitedVoidRunning = false;

  if (unlimitedVoidAnimationId) {
    cancelAnimationFrame(unlimitedVoidAnimationId);
    unlimitedVoidAnimationId = null;
  }

  updateSystemHud();
}

function disposeUnlimitedVoidRenderer() {
  stopUnlimitedVoidRenderer();

  if (unlimitedVoidRoot) {
    disposeObject3D(unlimitedVoidRoot);
  }

  if (unlimitedVoidRenderer) {
    unlimitedVoidRenderer.dispose();
  }

  unlimitedVoidRenderer = null;
  unlimitedVoidScene = null;
  unlimitedVoidCamera = null;
  unlimitedVoidRoot = null;
  unlimitedVoidStars = null;
  unlimitedVoidRings = [];
  unlimitedVoidNeedsResize = true;
}

function initMahoragaRenderer() {
  if (mahoragaRenderer || !mahoragaCanvas) {
    return Boolean(mahoragaRenderer);
  }

  if (!window.THREE || !THREE.GLTFLoader) {
    console.warn("Three.js or GLTFLoader is not available yet.");
    return false;
  }

  mahoragaRenderer = new THREE.WebGLRenderer({
    canvas: mahoragaCanvas,
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "high-performance"
  });
  mahoragaRenderer.setClearColor(0x000000, 0);
  mahoragaRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  mahoragaRenderer.shadowMap.enabled = false;
  mahoragaRenderer.sortObjects = false;

  mahoragaScene = new THREE.Scene();
  mahoragaCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  mahoragaCamera.position.set(0, 0.55, 5.8);

  const keyLight = new THREE.DirectionalLight(0xe8fff5, 1.9);
  keyLight.position.set(2.5, 3.8, 4.6);
  const rimLight = new THREE.DirectionalLight(0xd8ba62, 1.35);
  rimLight.position.set(-3.4, 2.2, -2.2);
  const fillLight = new THREE.AmbientLight(0x7bffe0, 0.75);

  mahoragaScene.add(fillLight, keyLight, rimLight);

  mahoragaRoot = new THREE.Group();
  mahoragaScene.add(mahoragaRoot);

  const eyeMaterial = new THREE.MeshBasicMaterial({
    color: 0xb9ffdf,
    transparent: true,
    opacity: 0.86
  });
  const eyeGeometry = new THREE.SphereGeometry(0.035, 12, 8);
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial.clone());

  leftEye.position.set(-0.14, 0.86, 0.82);
  rightEye.position.set(0.14, 0.86, 0.82);
  mahoragaEyes = [leftEye, rightEye];
  mahoragaRoot.add(leftEye, rightEye);

  resizeMahoragaRenderer();
  return true;
}

function resizeMahoragaRenderer() {
  if (!mahoragaRenderer || !mahoragaCanvas) {
    return;
  }

  const width = mahoragaCanvas.clientWidth || 1;
  const height = mahoragaCanvas.clientHeight || 1;

  if (!mahoragaNeedsResize && mahoragaCanvas.width === width && mahoragaCanvas.height === height) {
    return;
  }

  mahoragaRenderer.setSize(width, height, false);
  mahoragaCamera.aspect = width / height;
  mahoragaCamera.updateProjectionMatrix();
  mahoragaNeedsResize = false;
}

function createCompressedGltfLoader() {
  const loader = new THREE.GLTFLoader();

  if (THREE.DRACOLoader) {
    const dracoLoader = new THREE.DRACOLoader();

    dracoLoader.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/");
    loader.setDRACOLoader(dracoLoader);
  }

  if (window.MeshoptDecoder) {
    loader.setMeshoptDecoder(window.MeshoptDecoder);
  }

  return loader;
}

function loadMahoragaModel() {
  if (mahoragaModelPromise) {
    return mahoragaModelPromise;
  }

  if (isFileProtocolMode()) {
    mahoragaModelLoadFailed = true;
    updateSummonStatus("Summon: Open localhost for 3D Model", "denied");
    mahoragaModelPromise = Promise.reject(new Error("GLB models cannot reliably load from file:// URLs."));
    return mahoragaModelPromise;
  }

  if (!initMahoragaRenderer()) {
    mahoragaModelLoadFailed = true;
    return Promise.reject(new Error("Three.js renderer unavailable."));
  }

  mahoragaModelPromise = new Promise((resolve, reject) => {
    const loader = createCompressedGltfLoader();

    loader.load(MAHORAGA_MODEL_URL, (gltf) => {
      const model = gltf.scene;

      if (!mahoragaRoot) {
        disposeObject3D(model);
        reject(new Error("Mahoraga renderer was disposed before the model finished loading."));
        return;
      }

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.35 / maxDimension;

      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      model.traverse((child) => {
        if (!child.isMesh) {
          return;
        }

        child.frustumCulled = true;
        child.castShadow = false;
        child.receiveShadow = false;

        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          const clonedMaterials = materials.map((material) => {
            const clonedMaterial = material.clone();

            clonedMaterial.emissive = clonedMaterial.emissive || new THREE.Color(0x000000);
            clonedMaterial.emissiveIntensity = child.name.toLowerCase().includes("eye") ? 1.8 : 0.08;
            ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap"].forEach((textureKey) => {
              const texture = clonedMaterial[textureKey];

              if (texture && texture.isTexture) {
                texture.anisotropy = 1;
              }
            });

            return clonedMaterial;
          });

          child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
        }
      });

      mahoragaRoot.add(model);
      mahoragaModelLoaded = true;
      mahoragaModelLoadFailed = false;
      updateSummonStatus("Summon: 3D Model Ready", "pending");
      resolve(model);
    }, undefined, (error) => {
      console.error("Mahoraga model could not load:", error);
      mahoragaModelLoadFailed = true;
      mahoragaModelPromise = null;
      updateSummonStatus("Summon: 3D Model Missing", "denied");
      reject(error);
    });
  });

  return mahoragaModelPromise;
}

function renderMahoragaModel(time) {
  if (!isMahoragaRendererRunning || !mahoragaRenderer || !mahoragaScene || !mahoragaCamera || !mahoragaRoot) {
    return;
  }

  if (document.hidden) {
    stopMahoragaRenderLoop();
    return;
  }

  if (time - mahoragaLastRenderTime < mahoragaFrameIntervalMs) {
    mahoragaAnimationId = requestAnimationFrame(renderMahoragaModel);
    return;
  }

  mahoragaLastRenderTime = time;
  const elapsed = (time - mahoragaClockStart) * 0.001;
  const breath = Math.sin(elapsed * 1.45) * 0.018;

  mahoragaRoot.position.y = 0.18 + Math.sin(elapsed * 1.1) * 0.055;
  mahoragaRoot.rotation.y = Math.sin(elapsed * 0.62) * 0.1;
  mahoragaRoot.rotation.z = Math.sin(elapsed * 0.8) * 0.025;
  mahoragaRoot.scale.setScalar(1 + breath);

  if (mahoragaEyes) {
    const eyePulse = 0.58 + Math.sin(elapsed * 4.8) * 0.28;
    mahoragaEyes.forEach((eye) => {
      eye.material.opacity = eyePulse;
      eye.scale.setScalar(0.85 + eyePulse * 0.45);
    });
  }

  resizeMahoragaRenderer();
  mahoragaRenderer.render(mahoragaScene, mahoragaCamera);
  mahoragaAnimationId = requestAnimationFrame(renderMahoragaModel);
}

function shouldRenderMahoraga() {
  return !document.hidden && (
    summonLayer.classList.contains("mahoraga-summoning") ||
    summonLayer.classList.contains("mahoraga-active") ||
    summonLayer.classList.contains("mahoraga-dismissing")
  );
}

function startMahoragaRenderLoop() {
  if (isMahoragaRendererRunning) {
    return;
  }

  enforceSingleHeavyRenderer("mahoraga");

  if (!initMahoragaRenderer()) {
    return;
  }

  if (!shouldRenderMahoraga()) {
    return;
  }

  isMahoragaRendererRunning = true;
  mahoragaClockStart = performance.now();
  mahoragaLastRenderTime = 0;
  mahoragaAnimationId = requestAnimationFrame(renderMahoragaModel);
  updateSystemHud();
}

function stopMahoragaRenderLoop() {
  isMahoragaRendererRunning = false;

  if (mahoragaAnimationId) {
    cancelAnimationFrame(mahoragaAnimationId);
    mahoragaAnimationId = null;
  }

  updateSystemHud();
}

function initDomainModelRenderer() {
  if (domainModelRenderer || !domainModelCanvas) {
    return Boolean(domainModelRenderer);
  }

  if (!window.THREE || !THREE.GLTFLoader) {
    console.warn("Three.js or GLTFLoader is not available yet.");
    return false;
  }

  domainModelRenderer = new THREE.WebGLRenderer({
    canvas: domainModelCanvas,
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "high-performance"
  });
  domainModelRenderer.setClearColor(0x000000, 0);
  domainModelRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  domainModelRenderer.shadowMap.enabled = false;
  domainModelRenderer.sortObjects = false;

  domainModelScene = new THREE.Scene();
  domainModelCamera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  domainModelCamera.position.set(0, 0.35, 6.4);

  const keyLight = new THREE.DirectionalLight(0xffe0d8, 1.7);
  keyLight.position.set(2.2, 3.2, 4.2);
  const rimLight = new THREE.DirectionalLight(0xff2946, 1.2);
  rimLight.position.set(-3.4, 2.4, -2.2);
  const fillLight = new THREE.AmbientLight(0x5a1018, 0.9);

  domainModelScene.add(fillLight, keyLight, rimLight);

  domainModelRoot = new THREE.Group();
  domainModelScene.add(domainModelRoot);

  resizeDomainModelRenderer();
  return true;
}

function resizeDomainModelRenderer() {
  if (!domainModelRenderer || !domainModelCanvas) {
    return;
  }

  const width = domainModelCanvas.clientWidth || 1;
  const height = domainModelCanvas.clientHeight || 1;

  if (!domainModelNeedsResize && domainModelCanvas.width === width && domainModelCanvas.height === height) {
    return;
  }

  domainModelRenderer.setSize(width, height, false);
  domainModelCamera.aspect = width / height;
  domainModelCamera.updateProjectionMatrix();
  domainModelNeedsResize = false;
}

function optimizeLoadedMesh(child) {
  child.frustumCulled = true;
  child.castShadow = false;
  child.receiveShadow = false;

  if (!child.material) {
    return;
  }

  const materials = Array.isArray(child.material) ? child.material : [child.material];
  const clonedMaterials = materials.map((material) => {
    const clonedMaterial = material.clone();

    clonedMaterial.emissive = clonedMaterial.emissive || new THREE.Color(0x000000);
    clonedMaterial.emissiveIntensity = child.name.toLowerCase().includes("eye") ? 1.8 : 0.08;
    ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap"].forEach((textureKey) => {
      const texture = clonedMaterial[textureKey];

      if (texture && texture.isTexture) {
        texture.anisotropy = 1;
      }
    });

    return clonedMaterial;
  });

  child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
}

function normalizeModelToRoot(model, targetSize) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDimension;

  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  model.traverse((child) => {
    if (child.isMesh) {
      optimizeLoadedMesh(child);
    }
  });
}

function loadDomainModel(domain) {
  if (!domain || domain.key !== "domain-shrine") {
    return Promise.resolve(null);
  }

  if (domainModelPromise && activeDomainModelKey === domain.key) {
    return domainModelPromise;
  }

  disposeDomainModelRenderer();

  if (isFileProtocolMode()) {
    return Promise.reject(new Error("GLB models cannot reliably load from file:// URLs."));
  }

  if (!initDomainModelRenderer()) {
    return Promise.reject(new Error("Domain model renderer unavailable."));
  }

  activeDomainModelKey = domain.key;
  domainModelPromise = new Promise((resolve, reject) => {
    const loader = createCompressedGltfLoader();

    loader.load(SHRINE_MODEL_URL, (gltf) => {
      const model = gltf.scene;

      if (!domainModelRoot) {
        disposeObject3D(model);
        reject(new Error("Domain renderer was disposed before the model finished loading."));
        return;
      }

      normalizeModelToRoot(model, 3.05);
      model.position.y -= 0.12;
      domainModelRoot.add(model);
      resolve(model);
    }, undefined, (error) => {
      console.error("Domain model could not load:", error);
      disposeDomainModelRenderer();
      reject(error);
    });
  });

  return domainModelPromise;
}

function renderDomainModel(time) {
  if (!isDomainModelRendererRunning || !domainModelRenderer || !domainModelScene || !domainModelCamera || !domainModelRoot) {
    return;
  }

  if (document.hidden) {
    stopDomainModelRenderLoop();
    return;
  }

  if (time - domainModelLastRenderTime < mahoragaFrameIntervalMs) {
    domainModelAnimationId = requestAnimationFrame(renderDomainModel);
    return;
  }

  domainModelLastRenderTime = time;
  const elapsed = (time - domainModelClockStart) * 0.001;

  domainModelRoot.position.y = Math.sin(elapsed * 0.8) * 0.045;
  domainModelRoot.rotation.y = Math.sin(elapsed * 0.36) * 0.08;
  domainModelRoot.scale.setScalar(1 + Math.sin(elapsed * 1.15) * 0.012);

  resizeDomainModelRenderer();
  domainModelRenderer.render(domainModelScene, domainModelCamera);
  domainModelAnimationId = requestAnimationFrame(renderDomainModel);
}

function shouldRenderDomainModel() {
  return !document.hidden && domainModelLayer.classList.contains("model-active");
}

function startDomainModelRenderLoop() {
  if (isDomainModelRendererRunning) {
    return;
  }

  enforceSingleHeavyRenderer("domain-model");

  if (!initDomainModelRenderer() || !shouldRenderDomainModel()) {
    return;
  }

  isDomainModelRendererRunning = true;
  domainModelClockStart = performance.now();
  domainModelLastRenderTime = 0;
  domainModelAnimationId = requestAnimationFrame(renderDomainModel);
  updateSystemHud();
}

function stopDomainModelRenderLoop() {
  isDomainModelRendererRunning = false;

  if (domainModelAnimationId) {
    cancelAnimationFrame(domainModelAnimationId);
    domainModelAnimationId = null;
  }

  updateSystemHud();
}

async function startDomainModel(domain, options = {}) {
  const reveal = options.reveal !== false;

  if (!domain || domain.key !== "domain-shrine") {
    disposeDomainModelRenderer();
    return false;
  }

  try {
    await loadDomainModel(domain);

    if (reveal) {
      domainModelLayer.classList.add("model-active");
      shrineFallback?.classList.remove("fallback-active");
      startDomainModelRenderLoop();
    }

    return true;
  } catch (error) {
    console.warn("Domain model skipped:", error);

    if (reveal) {
      domainModelLayer?.classList.add("model-active");
      shrineFallback?.classList.add("fallback-active");
    }

    return false;
  }
}

function revealDomainModel(domain) {
  if (!domain || domain.key !== "domain-shrine") {
    return;
  }

  updateDomainStatus("Status: Shrine Manifesting", "pending");
  playDomainFlash();
  domainModelLayer?.classList.add("model-active");
  shrineFallback?.classList.add("fallback-active");
  startDomainModel(domain, { reveal: true });
}

function renderActivationProgress(percent) {
  const filledBlocks = Math.round(percent / 10);
  const emptyBlocks = 10 - filledBlocks;
  const meter = `${"█".repeat(filledBlocks)}${"░".repeat(emptyBlocks)} ${percent}%`;

  activationMeter.textContent = meter;
  activationProgressFill.style.transform = `scaleX(${percent / 100})`;
}

function clearActivationStepTimers() {
  activationStepTimers.forEach((timer) => clearTimeout(timer));
  activationStepTimers = [];
  clearTimeout(activationSequenceTimer);
}

function scheduleActivationStep(delay, callback) {
  const timer = setTimeout(callback, delay);

  activationStepTimers.push(timer);
}

function clearMahoragaTimers() {
  mahoragaTimers.forEach((timer) => clearTimeout(timer));
  mahoragaTimers = [];
}

function scheduleMahoragaStep(delay, callback) {
  const timer = setTimeout(callback, delay);

  mahoragaTimers.push(timer);
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

function stopAudioNodes(nodes) {
  nodes.forEach((node) => {
    try {
      if (node.stop) {
        node.stop();
      }

      if (node.disconnect) {
        node.disconnect();
      }
    } catch (error) {
      console.warn("Audio cleanup skipped:", error);
    }
  });
}

function stopActivationSoundtrack() {
  stopAudioNodes(buildupAudioNodes);
  buildupAudioNodes = [];
}

function stopInvocationAudio() {
  if (!invocationAudio) {
    return;
  }

  invocationAudio.pause();
  invocationAudio.currentTime = 0;
  invocationAudio = null;
}

function stopDomainAmbience() {
  stopAudioNodes(ambienceAudioNodes);
  ambienceAudioNodes = [];
}

function stopSummonAmbience() {
  stopAudioNodes(summonAudioNodes);
  summonAudioNodes = [];
}

async function startSummonAmbience() {
  try {
    const context = getAudioContext();
    await context.resume();

    stopSummonAmbience();

    const now = context.currentTime;
    const masterGain = context.createGain();
    const drone = context.createOscillator();
    const bell = context.createOscillator();
    const tremor = context.createOscillator();
    const filter = context.createBiquadFilter();

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.14, now + 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.07, now + 9.8);

    drone.type = "sawtooth";
    drone.frequency.setValueAtTime(38, now);
    drone.frequency.exponentialRampToValueAtTime(50, now + 8);

    tremor.type = "square";
    tremor.frequency.setValueAtTime(9, now);

    bell.type = "sine";
    bell.frequency.setValueAtTime(430, now + 2);
    bell.frequency.exponentialRampToValueAtTime(710, now + 5.2);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(240, now);
    filter.frequency.exponentialRampToValueAtTime(760, now + 7.5);

    drone.connect(filter);
    tremor.connect(filter);
    bell.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(context.destination);

    drone.start(now);
    tremor.start(now);
    bell.start(now + 2);
    bell.stop(now + 6.2);

    summonAudioNodes = [drone, tremor, bell, filter, masterGain];
  } catch (error) {
    console.warn("Summon ambience could not start:", error);
  }
}

function waitForAudioMetadata(audio) {
  if (!audio || Number.isFinite(audio.duration)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => resolve();

    audio.addEventListener("loadedmetadata", finish, { once: true });
    audio.addEventListener("durationchange", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    setTimeout(finish, 600);
  });
}

async function playInvocationAudio(domain) {
  if (!domain.audioSrc) {
    return null;
  }

  stopInvocationAudio();

  const audio = new Audio(domain.audioSrc);
  audio.volume = 0.95;
  audio.preload = "auto";
  invocationAudio = audio;

  audio.addEventListener("ended", () => {
    if (invocationAudio === audio) {
      invocationAudio = null;
    }
  }, { once: true });

  try {
    await audio.play();
    await waitForAudioMetadata(audio);
    return audio;
  } catch (error) {
    console.warn(`${domain.audioSrc} could not play:`, error);
    updateDomainStatus("Status: Audio File Missing", "pending");
    return null;
  }
}

async function startActivationSoundtrack() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  try {
    await context.resume();

    stopActivationSoundtrack();

    const now = context.currentTime;
    const masterGain = context.createGain();
    const lowDrone = context.createOscillator();
    const highPulse = context.createOscillator();
    const filter = context.createBiquadFilter();

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.32, now + 3.2);

    lowDrone.type = "sawtooth";
    lowDrone.frequency.setValueAtTime(55, now);
    lowDrone.frequency.exponentialRampToValueAtTime(110, now + 3.6);

    highPulse.type = "triangle";
    highPulse.frequency.setValueAtTime(220, now);
    highPulse.frequency.exponentialRampToValueAtTime(440, now + 3.4);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 3.4);

    lowDrone.connect(filter);
    highPulse.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(context.destination);

    lowDrone.start(now);
    highPulse.start(now);

    buildupAudioNodes = [lowDrone, highPulse, filter, masterGain];
  } catch (error) {
    console.warn("Activation soundtrack could not start:", error);
  }
}

async function startDomainAmbience(domain) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  try {
    await context.resume();

    stopDomainAmbience();

    const now = context.currentTime;
    const ambienceGain = context.createGain();
    const ambience = context.createOscillator();
    const filter = context.createBiquadFilter();
    const ambienceTone = {
      "domain-void": { frequency: 96, filter: 520 },
      "domain-shrine": { frequency: 54, filter: 260 }
    }[domain.key] || { frequency: 82, filter: 360 };

    ambienceGain.gain.setValueAtTime(0.0001, now);
    ambienceGain.gain.exponentialRampToValueAtTime(0.1, now + 0.4);

    ambience.type = "sine";
    ambience.frequency.setValueAtTime(ambienceTone.frequency, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(ambienceTone.filter, now);

    ambience.connect(filter);
    filter.connect(ambienceGain);
    ambienceGain.connect(context.destination);
    ambience.start(now);

    ambienceAudioNodes = [ambience, filter, ambienceGain];
  } catch (error) {
    console.warn("Domain ambience could not start:", error);
  }
}

// Keep the drawing canvas the same size as the video feed.
function resizeCanvasToVideo() {
  const videoWidth = webcamVideo.videoWidth;
  const videoHeight = webcamVideo.videoHeight;

  if (!videoWidth || !videoHeight) {
    return;
  }

  if (landmarkCanvas.width !== videoWidth || landmarkCanvas.height !== videoHeight) {
    landmarkCanvas.width = videoWidth;
    landmarkCanvas.height = videoHeight;
  }
}

function clearLandmarks() {
  canvasContext.clearRect(0, 0, landmarkCanvas.width, landmarkCanvas.height);
}

// Draw one line between two normalized MediaPipe landmarks.
function drawConnection(start, end) {
  canvasContext.beginPath();
  canvasContext.moveTo(start.x * landmarkCanvas.width, start.y * landmarkCanvas.height);
  canvasContext.lineTo(end.x * landmarkCanvas.width, end.y * landmarkCanvas.height);
  canvasContext.stroke();
}

// Draw one landmark dot.
function drawLandmark(landmark) {
  canvasContext.beginPath();
  canvasContext.arc(
    landmark.x * landmarkCanvas.width,
    landmark.y * landmarkCanvas.height,
    5,
    0,
    Math.PI * 2
  );
  canvasContext.fill();
}

// Draw all hand dots and the lines between them.
function drawHandLandmarks(handLandmarks) {
  const connections = window.HAND_CONNECTIONS || HAND_CONNECTIONS_FALLBACK;

  canvasContext.lineWidth = 4;
  canvasContext.strokeStyle = "#2ee59d";
  canvasContext.fillStyle = "#f7f7fb";

  connections.forEach(([startIndex, endIndex]) => {
    drawConnection(handLandmarks[startIndex], handLandmarks[endIndex]);
  });

  handLandmarks.forEach(drawLandmark);
}

function getDistance(pointA, pointB) {
  const xDistance = pointA.x - pointB.x;
  const yDistance = pointA.y - pointB.y;

  return Math.hypot(xDistance, yDistance);
}

function hasCompleteHand(handLandmarks, handInfo) {
  return handLandmarks.length === 21 && (!handInfo || handInfo.score >= 0.65);
}

// Convert raw landmark positions into simple open/closed finger states.
function getFingerStates(handLandmarks, handInfo) {
  if (!hasCompleteHand(handLandmarks, handInfo)) {
    return null;
  }

  const wrist = handLandmarks[0];
  const thumbTip = handLandmarks[4];
  const thumbBase = handLandmarks[2];
  const indexBase = handLandmarks[5];

  // For the other fingers, y gets smaller as a point moves upward on screen.
  const indexOpen = handLandmarks[8].y < handLandmarks[6].y && handLandmarks[8].y < handLandmarks[5].y;
  const middleOpen = handLandmarks[12].y < handLandmarks[10].y && handLandmarks[12].y < handLandmarks[9].y;
  const ringOpen = handLandmarks[16].y < handLandmarks[14].y && handLandmarks[16].y < handLandmarks[13].y;
  const pinkyOpen = handLandmarks[20].y < handLandmarks[18].y && handLandmarks[20].y < handLandmarks[17].y;
  const fourLongFingersOpen = indexOpen && middleOpen && ringOpen && pinkyOpen;

  // Thumb detection is trickier than the other fingers because thumbs move sideways.
  // A thumb can count as open if it is spread out OR lifted with an open palm.
  const thumbSpreadOpen = getDistance(thumbTip, indexBase) > getDistance(thumbBase, indexBase) * 1.12;
  const thumbLifted = thumbTip.y < thumbBase.y;
  const thumbClearlyTucked = getDistance(thumbTip, indexBase) < getDistance(thumbBase, indexBase) * 0.9;
  const thumbOpen = thumbSpreadOpen || (fourLongFingersOpen && thumbLifted && !thumbClearlyTucked);

  // If the hand is extremely tiny in the frame, avoid strong guesses.
  const palmSize = getDistance(wrist, handLandmarks[9]);
  if (palmSize < 0.08) {
    return null;
  }

  return {
    thumb: thumbOpen,
    index: indexOpen,
    middle: middleOpen,
    ring: ringOpen,
    pinky: pinkyOpen
  };
}

function countExtendedFingersFromStates(fingerStates) {
  return Object.values(fingerStates).filter(Boolean).length;
}

function isOpenPalmTechnique(fingerStates) {
  return Boolean(
    fingerStates &&
    fingerStates.index &&
    fingerStates.middle &&
    fingerStates.ring &&
    fingerStates.pinky
  );
}

function isBlueTechnique(fingerStates, analysis) {
  if (!fingerStates || !analysis) {
    return false;
  }

  const landmarks = analysis.landmarks;
  const palmSize = getDistance(landmarks[0], landmarks[9]);
  const pinchDistance = getDistance(landmarks[4], landmarks[8]);
  const middleDistance = getDistance(landmarks[8], landmarks[12]);
  const thumbIndexTouching = pinchDistance < palmSize * 0.5;
  const threeFingersRaised = fingerStates.middle && fingerStates.ring && fingerStates.pinky;
  const pinchSeparatedFromRaisedFingers = middleDistance > palmSize * 0.28;

  return thumbIndexTouching && threeFingersRaised && pinchSeparatedFromRaisedFingers;
}

function isFistTechnique(fingerStates) {
  return Boolean(
    fingerStates &&
    !fingerStates.index &&
    !fingerStates.middle &&
    !fingerStates.ring &&
    !fingerStates.pinky
  );
}

function getPalmCenter(handLandmarks) {
  const palmIndexes = [0, 5, 9, 13, 17];
  const center = palmIndexes.reduce((point, landmarkIndex) => {
    const landmark = handLandmarks[landmarkIndex];

    return {
      x: point.x + landmark.x / palmIndexes.length,
      y: point.y + landmark.y / palmIndexes.length
    };
  }, { x: 0, y: 0 });

  return center;
}

function getStagePosition(point) {
  return {
    x: `${(1 - point.x) * 100}%`,
    y: `${point.y * 100}%`
  };
}

function setTechniquePosition(name, point) {
  const position = getStagePosition(point);

  techniqueLayer.style.setProperty(`--${name}-x`, position.x);
  techniqueLayer.style.setProperty(`--${name}-y`, position.y);
}

function setPurplePosition(point) {
  const position = getStagePosition(point);

  techniqueLayer.style.setProperty("--purple-x", position.x);
  techniqueLayer.style.setProperty("--purple-y", position.y);
}

function getBlueTechniquePoint(analysis) {
  return {
    x: (analysis.landmarks[4].x + analysis.landmarks[8].x) / 2,
    y: (analysis.landmarks[4].y + analysis.landmarks[8].y) / 2
  };
}

function getTechniqueLabels() {
  const labels = [];

  if (activeTechniques.blue) labels.push("Blue");
  if (activeTechniques.red) labels.push("Red");
  if (activeTechniques.purple) labels.push("Purple");

  return labels.length ? labels.join(" + ") : "Standby";
}

function syncTechniqueLayerClasses() {
  const shouldMuteTechniqueBackdrop = hasHighPriorityEffect();

  techniqueLayer.classList.toggle("blue-active", activeTechniques.blue);
  techniqueLayer.classList.toggle("red-active", activeTechniques.red);
  techniqueLayer.classList.toggle("purple-active", activeTechniques.purple);
  domainStage.classList.toggle("technique-blue", activeTechniques.blue && !activeTechniques.purple && !shouldMuteTechniqueBackdrop);
  domainStage.classList.toggle("technique-red", activeTechniques.red && !activeTechniques.purple && !shouldMuteTechniqueBackdrop);
  domainStage.classList.toggle(
    "theme-purple",
    (activeTechniques.purple || techniqueLayer.classList.contains("purple-charging")) && !shouldMuteTechniqueBackdrop
  );
}

function updateTechniqueInstruction() {
  if (activeTechniques.blue && activeTechniques.red && !activeTechniques.purple) {
    updateTechniqueStatus("Technique: Blue + Red Ready - Say Purple", "connected");
    return;
  }

  updateTechniqueStatus(`Technique: ${getTechniqueLabels()}`, activeTechniques.blue || activeTechniques.red || activeTechniques.purple ? "connected" : "pending");
}

function destroyActiveTechniques() {
  const shouldDestroyBlue = activeTechniques.blue;
  const shouldDestroyRed = activeTechniques.red;
  const shouldDestroyPurple = activeTechniques.purple || techniqueLayer.classList.contains("purple-charging");

  clearTimeout(purpleChargeTimer);

  if (!shouldDestroyBlue && !shouldDestroyRed && !shouldDestroyPurple) {
    return;
  }

  if (shouldDestroyBlue) {
    techniqueLayer.classList.add("blue-destroying");
  }

  if (shouldDestroyRed) {
    techniqueLayer.classList.add("red-destroying");
  }

  if (shouldDestroyPurple) {
    techniqueLayer.classList.add("purple-destroying");
  }

  updateTechniqueStatus("Technique: Destroying", "pending");

  setTimeout(() => {
    activeTechniques.blue = false;
    activeTechniques.red = false;
    activeTechniques.purple = false;
    techniqueLayer.classList.remove("blue-destroying", "red-destroying", "purple-destroying", "purple-charging");
    syncTechniqueLayerClasses();
    updateTechniqueStatus("Technique: Destroyed", "pending");
  }, 950);
}

function findTechniqueHand(predicate) {
  return latestHandAnalyses.find((analysis) => predicate(analysis.fingerStates, analysis));
}

function getMahoragaSummonPair() {
  const fists = latestHandAnalyses.filter((analysis) => isFistTechnique(analysis.fingerStates));

  if (fists.length < 2) {
    return null;
  }

  for (let firstIndex = 0; firstIndex < fists.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < fists.length; secondIndex += 1) {
      const firstFist = fists[firstIndex];
      const secondFist = fists[secondIndex];
      const yDifference = Math.abs(firstFist.palmCenter.y - secondFist.palmCenter.y);
      const xDifference = Math.abs(firstFist.palmCenter.x - secondFist.palmCenter.x);
      const centerDistance = getDistance(firstFist.palmCenter, secondFist.palmCenter);

      if (yDifference < 0.22 && xDifference > 0.16 && xDifference < 0.62 && centerDistance < 0.68) {
        return firstFist.palmCenter.y < secondFist.palmCenter.y
          ? [firstFist, secondFist]
          : [secondFist, firstFist];
      }
    }
  }

  return null;
}

function isMahoragaSummonSignReady() {
  return Boolean(getMahoragaSummonPair());
}

function updateTechniquePositions() {
  if (activeTechniques.blue) {
    const blueHand = findTechniqueHand(isBlueTechnique) || latestHandAnalyses[0];

    if (blueHand) {
      const bluePoint = isBlueTechnique(blueHand.fingerStates, blueHand)
        ? getBlueTechniquePoint(blueHand)
        : blueHand.landmarks[8];

      setTechniquePosition("blue", bluePoint);
    }
  }

  if (activeTechniques.red) {
    const redHand = findTechniqueHand(isOpenPalmTechnique) || latestHandAnalyses[1] || latestHandAnalyses[0];

    if (redHand) {
      setTechniquePosition("red", redHand.palmCenter);
    }
  }

  const hasBlueAndRed = activeTechniques.blue && activeTechniques.red;

  if (hasBlueAndRed) {
    const bluePoint = {
      x: Number.parseFloat(techniqueLayer.style.getPropertyValue("--blue-x")) || 50,
      y: Number.parseFloat(techniqueLayer.style.getPropertyValue("--blue-y")) || 50
    };
    const redPoint = {
      x: Number.parseFloat(techniqueLayer.style.getPropertyValue("--red-x")) || 50,
      y: Number.parseFloat(techniqueLayer.style.getPropertyValue("--red-y")) || 50
    };

    techniqueLayer.style.setProperty("--purple-x", `${(bluePoint.x + redPoint.x) / 2}%`);
    techniqueLayer.style.setProperty("--purple-y", `${(bluePoint.y + redPoint.y) / 2}%`);
    return;
  }

  if (latestHandAnalyses.length > 0) {
    const averagePoint = latestHandAnalyses.reduce((point, analysis) => {
      return {
        x: point.x + analysis.palmCenter.x / latestHandAnalyses.length,
        y: point.y + analysis.palmCenter.y / latestHandAnalyses.length
      };
    }, { x: 0, y: 0 });

    setPurplePosition(averagePoint);
  }
}

function activateBlueTechnique() {
  if (!effectManager.canRunCommand("technique-blue", COMMAND_COOLDOWN_MS)) {
    updateTechniqueStatus("Technique: Stabilizing", "pending");
    return;
  }

  const blueHand = findTechniqueHand(isBlueTechnique);

  if (!blueHand) {
    updateTechniqueStatus("Technique: Blue Sign Required", "pending");
    return;
  }

  resetScene({
    preserveTechniques: true,
    statusMessage: "Status: Blue Theme"
  });
  clearTimeout(purpleChargeTimer);
  techniqueLayer.classList.remove("purple-charging");
  activeTechniques.blue = true;
  activeTechniques.purple = false;
  setCinematicActive(true);
  effectManager.start("background", "technique-blue", {
    priority: EFFECT_PRIORITY.LOW,
    cleanup: false
  });
  setTechniquePosition("blue", getBlueTechniquePoint(blueHand));
  syncTechniqueLayerClasses();
  if (!hasHighPriorityEffect()) {
    pulseStageEffect("energy-burst", 520);
  }
  updateTechniqueInstruction();
}

function activateRedTechnique() {
  if (!effectManager.canRunCommand("technique-red", COMMAND_COOLDOWN_MS)) {
    updateTechniqueStatus("Technique: Stabilizing", "pending");
    return;
  }

  const palmHand = findTechniqueHand(isOpenPalmTechnique);

  if (!palmHand) {
    updateTechniqueStatus("Technique: Open Palm Required", "pending");
    return;
  }

  resetScene({
    preserveTechniques: true,
    statusMessage: "Status: Red Theme"
  });
  clearTimeout(purpleChargeTimer);
  techniqueLayer.classList.remove("purple-charging");
  activeTechniques.red = true;
  activeTechniques.purple = false;
  setCinematicActive(true);
  effectManager.start("background", "technique-red", {
    priority: EFFECT_PRIORITY.LOW,
    cleanup: false
  });
  setTechniquePosition("red", palmHand.palmCenter);
  syncTechniqueLayerClasses();
  if (!hasHighPriorityEffect()) {
    pulseStageEffect("energy-burst", 520);
  }
  updateTechniqueInstruction();
}

function activatePurpleTechnique() {
  if (!effectManager.canRunCommand("technique-purple", HEAVY_EFFECT_COOLDOWN_MS)) {
    updateTechniqueStatus("Technique: Stabilizing", "pending");
    return;
  }

  if (!activeTechniques.blue || !activeTechniques.red) {
    updateTechniqueStatus("Technique: Blue + Red Required", "pending");
    return;
  }

  resetScene({
    preserveTechniques: true,
    statusMessage: "Status: Purple Theme"
  });
  activeTechniques.purple = false;
  techniqueLayer.classList.remove("purple-active");
  techniqueLayer.classList.add("purple-charging");
  setCinematicActive(true);
  effectManager.start("background", "technique-purple", {
    priority: EFFECT_PRIORITY.MEDIUM,
    cleanup: false
  });
  if (!hasHighPriorityEffect()) {
    domainStage.classList.add("theme-purple");
  }
  if (!hasHighPriorityEffect()) {
    runImpactVfx();
  }
  updateTechniquePositions();
  updateTechniqueStatus("Technique: Hollow Purple Charging", "pending");

  clearTimeout(purpleChargeTimer);
  purpleChargeTimer = setTimeout(() => {
    techniqueLayer.classList.remove("purple-charging");
    activeTechniques.blue = false;
    activeTechniques.red = false;
    activeTechniques.purple = true;
    syncTechniqueLayerClasses();
    if (!hasHighPriorityEffect()) {
      playDomainFlash();
      runImpactVfx();
    }
    updateTechniqueStatus("Technique: Hollow Purple", "connected");
  }, 1400);
}

function handleTechniqueCommand(command) {
  if (command.technique === "blue") {
    activateBlueTechnique();
    return true;
  }

  if (command.technique === "red") {
    activateRedTechnique();
    return true;
  }

  if (command.technique === "purple") {
    activatePurpleTechnique();
    return true;
  }

  return false;
}

async function activateMahoragaSummon(options = {}) {
  const skipGestureCheck = Boolean(options.skipGestureCheck);

  if (!effectManager.canRunCommand("summon-mahoraga", HEAVY_EFFECT_COOLDOWN_MS)) {
    updateSummonStatus("Summon: Stabilizing", "pending");
    return;
  }

  if (isMahoragaSummoning || isMahoragaPreparing) {
    return;
  }

  if (isFileProtocolMode()) {
    updateSummonStatus("Summon: Open localhost for 3D Model", "denied");
    return;
  }

  if (!skipGestureCheck && !isMahoragaSummonSignReady()) {
    updateSummonStatus("Summon: Two-Fist Sign Required", "pending");
    return;
  }

  resetScene({
    statusMessage: "Status: Summon Preparing"
  });
  isMahoragaPreparing = true;
  updateSummonStatus("Summon: Loading 3D Model", "pending");

  try {
    await loadMahoragaModel();
  } catch (error) {
    console.error("Mahoraga summon blocked:", error);
    isMahoragaPreparing = false;
    updateSummonStatus("Summon: 3D Model Error", "denied");
    return;
  }

  isMahoragaPreparing = false;

  if (!effectManager.start("summon", "mahoraga", {
    priority: EFFECT_PRIORITY.HIGH,
    cleanup: true,
    immediate: true
  })) {
    updateSummonStatus("Summon: Higher Priority Effect Active", "pending");
    return;
  }

  effectManager.start("audio", "summon-ambience", {
    priority: EFFECT_PRIORITY.MEDIUM,
    cleanup: true,
    immediate: true
  });

  isMahoragaSummoning = true;
  clearMahoragaTimers();
  setCinematicActive(true);
  setStageTheme("theme-mahoraga");
  domainStage.classList.add("vfx-summon", "audio-reactive");
  summonLayer.classList.remove("mahoraga-active", "mahoraga-summoning", "mahoraga-dismissing");
  void summonLayer.offsetWidth;
  summonLayer.classList.add("mahoraga-summoning");
  updateSummonStatus("Summon: Shadows Spreading", "pending");
  updateStageState("");
  runImpactVfx();
  startMahoragaRenderLoop();
  startSummonAmbience();

  scheduleMahoragaStep(2000, () => {
    updateSummonStatus("Summon: Wheel Manifesting", "pending");
  });

  scheduleMahoragaStep(5000, () => {
    updateSummonStatus("Summon: Ritual Circle Active", "pending");
  });

  scheduleMahoragaStep(8000, () => {
    playDomainFlash();
    runImpactVfx();
    updateSummonStatus("Summon: Mahoraga Emerging", "pending");
  });

  scheduleMahoragaStep(10000, () => {
    summonLayer.classList.remove("mahoraga-summoning");
    summonLayer.classList.add("mahoraga-active");
    domainStage.classList.remove("audio-reactive");
    isMahoragaSummoning = false;
    updateSummonStatus(
      mahoragaModelLoaded && !mahoragaModelLoadFailed ? "Summon: Mahoraga Active" : "Summon: 3D Model Loading",
      mahoragaModelLoaded && !mahoragaModelLoadFailed ? "connected" : "pending"
    );
  });
}

function stopSummonEffect(options = {}) {
  const animate = options.animate !== false;
  const reason = options.reason || "Summon: Standby";
  const isSummonVisible = summonLayer.classList.contains("mahoraga-active") ||
    summonLayer.classList.contains("mahoraga-summoning") ||
    isMahoragaSummoning;

  if (!isSummonVisible) {
    return;
  }

  clearMahoragaTimers();
  stopSummonAmbience();
  isMahoragaSummoning = false;
  isMahoragaPreparing = false;
  domainStage.classList.remove("vfx-summon", "audio-reactive", "theme-mahoraga");
  summonLayer.classList.remove("mahoraga-active", "mahoraga-summoning");

  if (!animate) {
    summonLayer.className = "summon-layer";
    disposeMahoragaRenderer();
    updateSummonStatus(reason, "pending");
    return;
  }

  summonLayer.classList.add("mahoraga-dismissing");
  updateSummonStatus(reason, "pending");

  setTimeout(() => {
    summonLayer.className = "summon-layer";
    disposeMahoragaRenderer();
    updateSummonStatus("Summon: Standby", "pending");
  }, 900);
}

function dismissMahoragaSummon() {
  effectManager.stop("summon", {
    reason: "Summon: Dismissed by Domain"
  });
}

function handleSummonCommand(command) {
  if (command.summon === "mahoraga") {
    activateMahoragaSummon();
    return true;
  }

  return false;
}

function summonMahoragaDirectly() {
  activateMahoragaSummon({ skipGestureCheck: true });
}

// Add future gestures here by checking the five finger states.
function classifyGesture(fingerStates) {
  if (!fingerStates) {
    return GESTURES.UNKNOWN;
  }

  const { index, middle, ring, pinky } = fingerStates;

  // A real fist often still shows the thumb slightly, so focus on the four long fingers.
  if (!index && !middle && !ring && !pinky) {
    return GESTURES.FIST;
  }

  // Peace sign should still count even if the thumb is visible from the camera angle.
  if (index && middle && !ring && !pinky) {
    return GESTURES.PEACE_SIGN;
  }

  return GESTURES.UNKNOWN;
}

function getSmoothedGesture(currentGesture) {
  gestureHistory.push(currentGesture);

  if (gestureHistory.length > GESTURE_HISTORY_SIZE) {
    gestureHistory.shift();
  }

  const gestureCounts = gestureHistory.reduce((counts, gesture) => {
    counts[gesture] = (counts[gesture] || 0) + 1;
    return counts;
  }, {});

  const bestGesture = Object.keys(gestureCounts).reduce((best, gesture) => {
    return gestureCounts[gesture] > gestureCounts[best] ? gesture : best;
  }, gestureHistory[0]);

  if (gestureCounts[bestGesture] >= GESTURE_MIN_MATCHES) {
    return bestGesture;
  }

  return GESTURES.UNKNOWN;
}

function resetGestureHistory() {
  gestureHistory = [];
}

function setDomainBackground(domain) {
  setCinematicActive(true);
  domainBackdrop.className = `domain-backdrop ${domain.className}`;
  document.body.classList.add("domain-active");
  setStageTheme(getDomainTheme(domain));
  if (domain.key === "domain-void") {
    disposeUnlimitedVoidRenderer();
    disposeDomainModelRenderer();
  } else {
    disposeUnlimitedVoidRenderer();
    startDomainModel(domain);
  }
  domainStage.classList.remove("audio-reactive", "vfx-summon");
  updateDomainState(`Domain: ${domain.label}`, "connected");
}

function previewDomainBackground(domain) {
  setCinematicActive(true);
  domainBackdrop.className = `domain-backdrop ${domain.className}`;
  document.body.classList.add("domain-active");
  setStageTheme(getDomainTheme(domain));
  if (domain.key === "domain-void") {
    disposeUnlimitedVoidRenderer();
  }
  updateDomainState(`Domain: ${domain.label} Forming`, "pending");
}

function clearFormationState() {
  FORMING_CLASSES.forEach((className) => {
    domainStage.classList.remove(className);
  });
  domainStage.style.removeProperty("--formation-duration");
}

function clearVoidSequenceState(options = {}) {
  VOID_SEQUENCE_CLASSES.forEach((className) => {
    if (options.keepActive && className === "void-active") {
      return;
    }

    domainStage.classList.remove(className);
  });
}

function playDomainFlash() {
  domainStage.classList.remove("domain-flash");
  void domainStage.offsetWidth;
  domainStage.classList.add("domain-flash");
  runImpactVfx();
}

function startDomainTransition() {
  domainStage.classList.remove("domain-switching");
  void domainStage.offsetWidth;
  domainStage.classList.add("domain-switching");
  pulseStageEffect("screen-shake", 420);
}

function resetDomain(expectedDomainKey = activeDomainKey) {
  if (expectedDomainKey !== activeDomainKey) {
    return;
  }

  activeDomainKey = "default";
  activeDomainGesture = GESTURES.NO_GESTURE;
  isDomainModeActive = false;
  isActivationSequenceRunning = false;
  activeTechniques = {
    blue: false,
    red: false,
    purple: false
  };
  techniqueLayer.className = "technique-layer";
  domainBackdrop.className = "domain-backdrop";
  document.body.classList.remove("domain-active");
  setCinematicActive(false);
  clearStageTheme();
  domainStage.classList.remove("technique-blue", "technique-red", "audio-reactive", "vfx-summon");
  MOMENTARY_VFX_CLASSES.forEach((className) => domainStage.classList.remove(className));
  domainStage.classList.remove("void-awakening");
  clearVoidSequenceState();
  domainStage.classList.remove("is-activating");
  domainStage.classList.remove("domain-switching");
  domainStage.classList.remove("domain-flash");
  clearFormationState();
  clearActivationStepTimers();
  clearMahoragaTimers();
  clearTimeout(purpleChargeTimer);
  disposeUnlimitedVoidRenderer();
  disposeDomainModelRenderer();
  disposeMahoragaRenderer();
  stopActivationSoundtrack();
  stopInvocationAudio();
  stopDomainAmbience();
  stopSummonAmbience();
  isMahoragaSummoning = false;
  summonLayer.className = "summon-layer";
  Object.keys(effectManager.active).forEach((category) => {
    effectManager.active[category] = null;
  });
  document.body.classList.remove("performance-heavy-active");
  updateDomainStatus("Status: Idle", "pending");
  updateDomainState("Domain: Default", "pending");
  updateTechniqueStatus("Technique: Standby", "pending");
  updateSummonStatus("Summon: Standby", "pending");
  updateStageState("");
}

function resetScene(options = {}) {
  const preserveTechniques = Boolean(options.preserveTechniques);
  const preserveDomainMode = Boolean(options.preserveDomainMode);
  const statusMessage = options.statusMessage || "Status: Idle";

  clearTimeout(activationSequenceTimer);
  clearTimeout(purpleChargeTimer);
  clearActivationStepTimers();
  clearMahoragaTimers();
  clearFormationState();
  stopActivationSoundtrack();
  stopInvocationAudio();
  stopDomainAmbience();
  stopSummonAmbience();
  disposeUnlimitedVoidRenderer();
  disposeDomainModelRenderer();
  disposeMahoragaRenderer();

  isMahoragaSummoning = false;
  isMahoragaPreparing = false;
  isActivationSequenceRunning = false;
  activeDomainKey = "default";
  activeDomainGesture = GESTURES.NO_GESTURE;

  if (!preserveDomainMode) {
    isDomainModeActive = false;
  }

  summonLayer.className = "summon-layer";
  domainBackdrop.className = "domain-backdrop";
  document.body.classList.remove("domain-active", "performance-heavy-active");
  setCinematicActive(false);
  clearStageTheme();
  domainStage.classList.remove(
    "technique-blue",
    "technique-red",
    "theme-purple",
    "audio-reactive",
    "vfx-summon",
    "void-awakening",
    "is-activating",
    "domain-switching",
    "domain-flash"
  );
  clearVoidSequenceState();
  MOMENTARY_VFX_CLASSES.forEach((className) => domainStage.classList.remove(className));

  if (!preserveTechniques) {
    activeTechniques = {
      blue: false,
      red: false,
      purple: false
    };
    techniqueLayer.className = "technique-layer";
    updateTechniqueStatus("Technique: Standby", "pending");
  } else {
    techniqueLayer.classList.remove("blue-destroying", "red-destroying", "purple-destroying", "purple-charging");
    syncTechniqueLayerClasses();
  }

  Object.keys(effectManager.active).forEach((category) => {
    effectManager.active[category] = null;
  });

  effectManager.syncPriorityClass();
  updateDomainStatus(statusMessage, "pending");
  updateDomainState("Domain: Default", "pending");
  updateSummonStatus("Summon: Standby", "pending");
  updateStageState("");
}

function showActivationSequence() {
  updateStageState("");
  setCinematicActive(true);
  activationText.textContent = "[ CURSED ENERGY DETECTED ]";
  activationSubtext.textContent = "";
  activationMeter.textContent = "";
  activationProgressFill.style.transform = "scaleX(0)";
  domainStage.classList.add("is-activating");
  updateDomainStatus("Status: Energy Detected", "pending");
  updateDomainState("Domain: Charging", "pending");
  stopDomainAmbience();
  startActivationSoundtrack();

  scheduleActivationStep(500, () => {
    activationText.textContent = "Synchronizing...";
    activationSubtext.textContent = "Cursed energy signature locked";
    updateDomainStatus("Status: Synchronizing", "pending");
    renderActivationProgress(20);
  });

  scheduleActivationStep(1150, () => {
    renderActivationProgress(45);
  });

  scheduleActivationStep(1800, () => {
    renderActivationProgress(78);
  });

  scheduleActivationStep(2450, () => {
    renderActivationProgress(100);
  });

  scheduleActivationStep(3000, () => {
    activationText.textContent = "BARRIER FORMING...";
    activationSubtext.textContent = "Expanding innate domain";
    updateDomainStatus("Status: Barrier Forming", "pending");
  });
}

function getAudioSequenceDuration(audio, domain) {
  if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
    return Math.max(audio.duration * 1000, 1200);
  }

  return domain.audioFlashDelayMs || DEFAULT_AUDIO_FLASH_DELAY_MS;
}

async function showUnlimitedVoidInvocationSequence(domain) {
  updateStageState("");
  activationText.textContent = "";
  activationSubtext.textContent = "";
  activationMeter.textContent = "";
  activationProgressFill.style.transform = "scaleX(0)";
  domainStage.classList.remove("is-activating", "audio-reactive", "domain-switching", "domain-flash");
  clearFormationState();
  clearVoidSequenceState();
  stopActivationSoundtrack();
  stopDomainAmbience();
  stopInvocationAudio();
  updateDomainStatus("Status: Silence", "pending");
  updateDomainState("Domain: None", "pending");
  setStageTheme(getDomainTheme(domain));
  domainBackdrop.className = "domain-backdrop domain-void";
  setCinematicActive(false);

  domainStage.classList.add("void-silence");

  scheduleActivationStep(1050, () => {
    setCinematicActive(true);
    domainStage.classList.add("void-distorting");
    updateDomainStatus("Status: Reality Fracture", "pending");
    startDomainAmbience(domain);
  });

  scheduleActivationStep(1450, () => {
    domainStage.classList.add("void-expansion");
    playInvocationAudio(domain);
  });

  scheduleActivationStep(2250, () => {
    domainStage.classList.add("void-tearing");
    updateDomainStatus("Status: Reality Tearing", "pending");
  });

  scheduleActivationStep(3150, () => {
    domainStage.classList.add("void-observing");
    updateDomainStatus("Status: First Observation", "pending");
  });

  scheduleActivationStep(4700, () => {
    domainStage.classList.add("void-knowledge");
    updateDomainStatus("Status: Knowledge Manifesting", "pending");
  });

  scheduleActivationStep(6100, () => {
    domainStage.classList.remove("is-activating", "void-limitless");
    previewDomainBackground(domain);
    domainStage.classList.add("void-opening");
    updateDomainStatus("Status: Limitless State", "pending");
    updateDomainState("Domain: LIMITLESS Forming", "pending");
  });

  scheduleActivationStep(7050, () => {
    domainStage.classList.add("void-active");
    updateDomainStatus("Status: Unlimited Void Open", "connected");
  });

  return UNLIMITED_VOID_SEQUENCE_MS;
}

async function showAudioInvocationSequence(domain) {
  if (domain.lightweightVoid) {
    return showUnlimitedVoidInvocationSequence(domain);
  }

  updateStageState("");
  setCinematicActive(true);
  activationText.textContent = "";
  activationSubtext.textContent = "";
  activationMeter.textContent = "";
  activationProgressFill.style.transform = "scaleX(0)";
  domainStage.classList.remove("is-activating");
  clearFormationState();
  updateDomainStatus("Status: Invocation Playing", "pending");
  updateDomainState(`Domain: ${domain.label} Incoming`, "pending");
  setStageTheme(getDomainTheme(domain));
  domainStage.classList.add("audio-reactive");
  stopActivationSoundtrack();
  stopDomainAmbience();
  const audio = await playInvocationAudio(domain);
  const sequenceDuration = getAudioSequenceDuration(audio, domain);

  if (domain.formDuringAudio) {
    previewDomainBackground(domain);
    domainStage.style.setProperty("--formation-duration", `${sequenceDuration}ms`);
    domainStage.classList.add(domain.formingClass || "domain-forming");
    updateDomainStatus(domain.formingStatus || "Status: Domain Forming", "pending");

    if (domain.modelRevealDelayMs) {
      startDomainModel(domain, { reveal: false });
      scheduleActivationStep(Math.min(domain.modelRevealDelayMs, sequenceDuration - 700), () => {
        revealDomainModel(domain);
      });
    } else {
      startDomainModel(domain);
    }
  }

  return sequenceDuration;
}

function completeActivationSequence(domain) {
  stopActivationSoundtrack();
  setDomainBackground(domain);
  playDomainFlash();
  domainStage.classList.remove("audio-reactive");
  domainStage.classList.remove("is-activating");
  domainStage.classList.remove("domain-switching");
  updateDomainStatus("Status: Domain Active", "connected");
  updateStageState("");
  isActivationSequenceRunning = false;
  startDomainAmbience(domain);
}

function completeAudioInvocationSequence(domain) {
  setDomainBackground(domain);
  if (!domain.lightweightVoid) {
    playDomainFlash();
  } else {
    clearVoidSequenceState({ keepActive: true });
    domainStage.classList.add("void-active");
  }
  domainStage.classList.remove("audio-reactive");
  domainStage.classList.remove("void-awakening");
  domainStage.classList.remove("is-activating");
  domainStage.classList.remove("domain-switching");
  clearFormationState();
  updateDomainStatus(domain.lightweightVoid ? "Status: Unlimited Void Open" : "Status: Domain Active", "connected");
  updateDomainState(`Domain: ${domain.label}`, "connected");
  updateStageState("");
  isActivationSequenceRunning = false;
}

function activateDomainForGesture(gesture) {
  const domain = DOMAIN_MAP[gesture];

  if (!domain) {
    return;
  }

  if (isActivationSequenceRunning) {
    return;
  }

  const now = Date.now();

  if (now - lastDomainActivationTime < DOMAIN_COOLDOWN_MS) {
    return;
  }

  if (!effectManager.canRunCommand(`domain-${domain.key}`, HEAVY_EFFECT_COOLDOWN_MS)) {
    updateDomainStatus("Status: Stabilizing", "pending");
    return;
  }

  if (activeDomainKey === domain.key) {
    return;
  }

  resetScene({
    preserveDomainMode: true,
    statusMessage: "Status: Domain Preparing"
  });

  if (!effectManager.start("domain", domain.key, {
    priority: EFFECT_PRIORITY.HIGH,
    cleanup: true,
    immediate: true
  })) {
    updateDomainStatus("Status: Higher Priority Effect Active", "pending");
    return;
  }

  lastDomainActivationTime = now;
  activeDomainKey = domain.key;
  activeDomainGesture = gesture;
  isActivationSequenceRunning = true;

  dismissMahoragaSummon();
  clearTimeout(activationSequenceTimer);
  clearActivationStepTimers();
  stopInvocationAudio();
  if (!domain.lightweightVoid) {
    startDomainTransition();
  }

  if (domain.audioSrc) {
    effectManager.start("audio", `domain-audio-${domain.key}`, {
      priority: EFFECT_PRIORITY.HIGH,
      cleanup: true,
      immediate: true
    });

    showAudioInvocationSequence(domain).then((sequenceDuration) => {
      clearTimeout(activationSequenceTimer);
      activationSequenceTimer = setTimeout(() => {
        completeAudioInvocationSequence(domain);
      }, sequenceDuration);
    }).catch((error) => {
      console.error("Audio invocation sequence error:", error);
      completeAudioInvocationSequence(domain);
    });

    return;
  }

  showActivationSequence();

  activationSequenceTimer = setTimeout(() => {
    completeActivationSequence(domain);
  }, ACTIVATION_SEQUENCE_MS);
}

function maybeSwitchDomainForGesture(gesture) {
  if (!isDomainModeActive || isActivationSequenceRunning) {
    return;
  }

  if (!isActivationGesture(gesture) || gesture === activeDomainGesture) {
    return;
  }

  activateDomainForGesture(gesture);
}

function normalizeTranscript(transcript) {
  return transcript
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findVoiceCommand(transcript) {
  const normalizedTranscript = normalizeTranscript(transcript);

  return Object.values(VOICE_COMMANDS).find((command) => {
    const phrases = command.aliases || [command.phrase];

    return phrases.some((phrase) => normalizedTranscript.includes(normalizeTranscript(phrase)));
  });
}

function isActivationGesture(gesture) {
  return Boolean(DOMAIN_MAP[gesture]);
}

function getVoiceCommandKey(command) {
  return command.phrase || command.label || "";
}

function restartSpeechRecognitionSoon(delay = 260) {
  if (!shouldKeepListening || !speechRecognition) {
    return;
  }

  clearTimeout(speechRestartTimer);
  speechRestartTimer = setTimeout(() => {
    if (!shouldKeepListening || isSpeechRecognitionActive) {
      return;
    }

    try {
      speechRecognition.start();
    } catch (error) {
      console.warn("Speech recognition restart skipped:", error);
    }
  }, delay);
}

function refreshVoiceRecognitionAfterCommand() {
  if (!shouldKeepListening || !speechRecognition) {
    return;
  }

  try {
    if (isSpeechRecognitionActive) {
      speechRecognition.stop();
      return;
    }
  } catch (error) {
    console.warn("Speech recognition stop skipped:", error);
  }

  restartSpeechRecognitionSoon();
}

function handleVoiceCommand(command) {
  const now = Date.now();
  const commandKey = getVoiceCommandKey(command);

  if (commandKey === lastVoiceCommandKey && now - lastVoiceMatchTime < VOICE_MATCH_COOLDOWN_MS) {
    return;
  }

  lastVoiceMatchTime = now;
  lastVoiceCommandKey = commandKey;
  lastCommandLabel = command.label;
  updateVoiceStatus(`Voice: ${command.label} ✓`, "connected");

  if (handleTechniqueCommand(command)) {
    refreshVoiceRecognitionAfterCommand();
    return;
  }

  if (handleSummonCommand(command)) {
    refreshVoiceRecognitionAfterCommand();
    return;
  }

  if (command.phrase !== VOICE_COMMANDS.DOMAIN_EXPANSION.phrase) {
    updateDomainStatus("Status: Waiting for Domain Expansion", "pending");
    refreshVoiceRecognitionAfterCommand();
    return;
  }

  resetScene({
    preserveDomainMode: true,
    statusMessage: "Status: Domain Expansion"
  });

  if (!isActivationGesture(currentStableGesture)) {
    updateDomainStatus("Status: Gesture Required", "pending");
    refreshVoiceRecognitionAfterCommand();
    return;
  }

  isDomainModeActive = true;
  activateDomainForGesture(currentStableGesture);
  refreshVoiceRecognitionAfterCommand();
}

function handleSpeechResult(event) {
  markUserActivity();

  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    const result = event.results[index];
    const transcript = result[0].transcript;
    const command = findVoiceCommand(transcript);

    if (command) {
      handleVoiceCommand(command);
    } else if (result.isFinal) {
      updateVoiceStatus(`Voice Heard: ${normalizeTranscript(transcript).slice(0, 24) || "Unknown"}`, "pending");
    } else {
      updateVoiceStatus("Voice: Hearing...", "pending");
    }
  }
}

async function requestMicrophonePermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("This browser does not support microphone access.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

  // Speech recognition opens its own audio input, so this permission stream can close.
  stream.getTracks().forEach((track) => track.stop());
}

function createSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("Web Speech API is not supported in this browser.");
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "en-US";

  speechRecognition.onstart = () => {
    isSpeechRecognitionActive = true;
    clearTimeout(speechRestartTimer);
    updateMicrophoneStatus("✓ Microphone Active", "connected");
    updateVoiceStatus("Voice: Listening...", "pending");
  };

  speechRecognition.onresult = handleSpeechResult;

  speechRecognition.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      shouldKeepListening = false;
      updateMicrophoneStatus("Microphone Access Denied", "denied");
      updateVoiceStatus("Voice: Mic Permission Denied", "denied");
      return;
    }

    if (event.error === "no-speech") {
      updateVoiceStatus("Voice: Listening...", "pending");
      restartSpeechRecognitionSoon(360);
      return;
    }

    updateVoiceStatus("Voice: Restarting Listener", "pending");
    isSpeechRecognitionActive = false;
    restartSpeechRecognitionSoon(420);
  };

  speechRecognition.onend = () => {
    isSpeechRecognitionActive = false;

    if (!shouldKeepListening) {
      return;
    }

    restartSpeechRecognitionSoon(260);
  };
}

async function startVoiceRecognition() {
  try {
    createSpeechRecognition();
  } catch (error) {
    console.error("Speech recognition setup error:", error);
    shouldKeepListening = false;
    updateMicrophoneStatus("Microphone Unavailable", "denied");
    updateVoiceStatus("Voice: Speech API Unsupported", "denied");
    return;
  }

  try {
    await requestMicrophonePermission();
    shouldKeepListening = true;
    restartSpeechRecognitionSoon(0);
  } catch (error) {
    console.error("Microphone access error:", error);
    shouldKeepListening = false;
    updateMicrophoneStatus("Microphone Access Denied", "denied");
    updateVoiceStatus("Voice: Mic Permission Denied", "denied");
  }
}

// MediaPipe calls this function after it finishes reading a video frame.
function handleHandResults(results) {
  resizeCanvasToVideo();
  clearLandmarks();

  const detectedHands = results.multiHandLandmarks || [];
  const detectedHandLabels = results.multiHandedness || [];

  if (detectedHands.length > 0) {
    markUserActivity();

    let bestGesture = GESTURES.UNKNOWN;
    const handAnalyses = [];
    const totalFingerCount = detectedHands.reduce((total, handLandmarks, index) => {
      const handInfo = detectedHandLabels[index];
      const fingerStates = getFingerStates(handLandmarks, handInfo);
      const handGesture = classifyGesture(fingerStates);

      drawHandLandmarks(handLandmarks);
      handAnalyses.push({
        landmarks: handLandmarks,
        fingerStates,
        gesture: handGesture,
        palmCenter: getPalmCenter(handLandmarks)
      });

      if (bestGesture === GESTURES.UNKNOWN && handGesture !== GESTURES.UNKNOWN) {
        bestGesture = handGesture;
      }

      if (!fingerStates) {
        return total;
      }

      return total + countExtendedFingersFromStates(fingerStates);
    }, 0);
    const smoothedGesture = getSmoothedGesture(bestGesture);
    currentStableGesture = smoothedGesture;
    latestHandAnalyses = handAnalyses;

    updateHandStatus("✓ Hand Tracking Active", "connected");
    updateFingerStatus(totalFingerCount, "connected");
    updateGestureStatus(smoothedGesture, smoothedGesture === GESTURES.UNKNOWN ? "pending" : "connected");
    updateTechniquePositions();
    maybeSwitchDomainForGesture(smoothedGesture);
  } else {
    currentStableGesture = GESTURES.NO_GESTURE;
    latestHandAnalyses = [];
    resetGestureHistory();
    updateHandStatus("No Hands Found", "pending");
    updateFingerStatus(0, "pending");
    updateGestureStatus(GESTURES.NO_GESTURE, "pending");
  }
}

// Set up MediaPipe Hands. The model files are loaded from the same CDN package.
function setupHandsModel() {
  if (!window.Hands) {
    throw new Error("MediaPipe Hands did not load.");
  }

  handsModel = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  const profile = QUALITY_PROFILES[currentQualityLevel || "full"];

  handsModel.setOptions({
    maxNumHands: 2,
    modelComplexity: profile.modelComplexity,
    minDetectionConfidence: profile.minDetectionConfidence,
    minTrackingConfidence: profile.minTrackingConfidence
  });

  handsModel.onResults(handleHandResults);
  isHandModelReady = true;
}

// Send video frames to MediaPipe without stacking slow requests.
async function trackHands(time = performance.now()) {
  if (document.hidden) {
    handTrackingAnimationId = null;
    return;
  }

  if (Date.now() - lastUserActivityTime > IDLE_OPTIMIZATION_MS && currentStableGesture === GESTURES.NO_GESTURE) {
    suspendHandTrackingForIdle();
    return;
  }

  const enoughTimePassed = time - lastHandTrackingTime >= currentHandTrackingIntervalMs;

  if (enoughTimePassed && isHandModelReady && !isProcessingFrame && webcamVideo.readyState >= 2) {
    try {
      lastHandTrackingTime = time;
      isProcessingFrame = true;
      await handsModel.send({ image: webcamVideo });
    } catch (error) {
      console.error("Hand tracking error:", error);
      updateHandStatus("Hand Tracking Error", "denied");
    } finally {
      isProcessingFrame = false;
    }
  }

  handTrackingAnimationId = requestAnimationFrame(trackHands);
}

function startHandTrackingLoop() {
  if (handTrackingAnimationId || !isHandModelReady) {
    return;
  }

  isHandTrackingSuspendedForIdle = false;
  document.body.classList.remove("tracking-suspended");
  lastHandTrackingTime = 0;
  handTrackingAnimationId = requestAnimationFrame(trackHands);
}

function stopHandTrackingLoop() {
  if (!handTrackingAnimationId) {
    return;
  }

  cancelAnimationFrame(handTrackingAnimationId);
  handTrackingAnimationId = null;
  isProcessingFrame = false;
}

function suspendHandTrackingForIdle() {
  if (isHandTrackingSuspendedForIdle) {
    return;
  }

  isHandTrackingSuspendedForIdle = true;
  stopHandTrackingLoop();
  clearLandmarks();
  latestHandAnalyses = [];
  currentStableGesture = GESTURES.NO_GESTURE;
  resetGestureHistory();
  document.body.classList.add("tracking-suspended");
  updateHandStatus("Hand Tracking Paused", "pending");
  updateFingerStatus(0, "pending");
  updateGestureStatus(GESTURES.NO_GESTURE, "pending");
  updatePerformanceHud();
}

function resumeHandTrackingFromIdle() {
  if (!systemStarted || !isHandModelReady || document.hidden) {
    return;
  }

  if (!isHandTrackingSuspendedForIdle && handTrackingAnimationId) {
    return;
  }

  isHandTrackingSuspendedForIdle = false;
  document.body.classList.remove("tracking-suspended");
  updateHandStatus("No Hands Found", "pending");
  startHandTrackingLoop();
}

function startHandTrackingSystem() {
  if (isHandModelReady || !systemStarted) {
    return;
  }

  try {
    updateHandStatus("Hand Tracking Starting", "pending");
    setupHandsModel();
    updateHandStatus("No Hands Found", "pending");
    updateFingerStatus(0, "pending");
    updateGestureStatus(GESTURES.NO_GESTURE, "pending");
    updateDomainStatus("Status: Idle", "pending");
    updateDomainState("Domain: Default", "pending");
    updateTechniqueStatus("Technique: Standby", "pending");
    updateSummonStatus("Summon: Standby", "pending");
    startHandTrackingLoop();
  } catch (error) {
    console.error("MediaPipe setup error:", error);
    updateHandStatus("Hand Tracking Error", "denied");
    updateFingerStatus(0, "denied");
    updateGestureStatus(GESTURES.NO_GESTURE, "denied");
    updateDomainStatus("Status: Idle", "denied");
    updateDomainState("Domain: Default", "denied");
    updateTechniqueStatus("Technique: Standby", "denied");
    updateSummonStatus("Summon: Standby", "denied");
  }
}

// This function asks the browser for camera access and starts the live video.
async function startCamera() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("This browser does not support webcam access.");
    }

    // getUserMedia asks the user for permission to use their webcam.
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      },
      audio: false
    });

    // The camera stream is attached to the video element so it can play live.
    webcamVideo.srcObject = stream;
    await webcamVideo.play();

    resizeCanvasToVideo();
    emptyState.classList.add("hidden");
    updateCameraStatus("✓ Camera Connected", "connected");
    updateHandStatus("Hand Tracking Standby", "pending");
  } catch (error) {
    console.error("Camera access error:", error);

    clearLandmarks();
    emptyState.textContent = "Camera access was denied or no camera was found.";
    emptyState.classList.remove("hidden");
    updateCameraStatus("Camera Access Denied", "denied");
    updateHandStatus("No Hands Found", "denied");
    updateFingerStatus(0, "denied");
    updateGestureStatus(GESTURES.NO_GESTURE, "denied");
    updateDomainStatus("Status: Idle", "denied");
    updateDomainState("Domain: Default", "denied");
    updateTechniqueStatus("Technique: Standby", "denied");
    updateSummonStatus("Summon: Standby", "denied");
    return;
  }
}

function setStartupPrompt() {
  updateCameraStatus("Click Start System", "pending");
  updateHandStatus("Hand Tracking Standby", "pending");
  updateMicrophoneStatus("Click Start System", "pending");
  updateFingerStatus(0, "pending");
  updateGestureStatus(GESTURES.NO_GESTURE, "pending");
  updateVoiceStatus("Voice: Standby", "pending");
  updateDomainStatus("Status: Idle", "pending");
  updateDomainState("Domain: Default", "pending");
  updateTechniqueStatus("Technique: Standby", "pending");
  updateSummonStatus(
    isFileProtocolMode() ? "Summon: Open localhost for 3D Model" : "Summon: Standby",
    isFileProtocolMode() ? "denied" : "pending"
  );
  updatePerformanceHud();
}

function formatQualityLabel(level) {
  if (!level) {
    return "Full";
  }

  return level.charAt(0).toUpperCase() + level.slice(1);
}

function updatePerformanceHud(fps = currentFps) {
  if (!fpsReadout || !qualityReadout || !heavyFxReadout || !idleReadout) {
    return;
  }

  fpsReadout.textContent = fps > 0 ? String(fps) : "--";
  qualityReadout.textContent = formatQualityLabel(currentQualityLevel || "full");
  heavyFxReadout.textContent = hasHighPriorityEffect() ? "On" : "Off";
  idleReadout.textContent = document.body.classList.contains("performance-idle") ? "Yes" : "No";
  updateSystemHud();
}

function markUserActivity() {
  lastUserActivityTime = Date.now();
  resumeHandTrackingFromIdle();

  if (document.body.classList.contains("performance-idle")) {
    document.body.classList.remove("performance-idle");
    updatePerformanceHud();

    if (shouldRenderMahoraga()) {
      startMahoragaRenderLoop();
    }

    if (shouldRenderUnlimitedVoid()) {
      startUnlimitedVoidRenderer();
    }

    if (shouldRenderDomainModel()) {
      startDomainModelRenderLoop();
    }
  }
}

function applyQualityProfile(level) {
  if (!QUALITY_PROFILES[level] || currentQualityLevel === level) {
    return;
  }

  currentQualityLevel = level;
  const profile = QUALITY_PROFILES[level];

  currentHandTrackingIntervalMs = 1000 / profile.handFps;
  mahoragaFrameIntervalMs = 1000 / profile.mahoragaFps;
  document.body.dataset.quality = level;

  Object.keys(QUALITY_PROFILES).forEach((profileName) => {
    document.body.classList.toggle(`quality-${profileName}`, profileName === level);
  });

  updatePerformanceHud();

  if (handsModel) {
    handsModel.setOptions({
      maxNumHands: 2,
      modelComplexity: profile.modelComplexity,
      minDetectionConfidence: profile.minDetectionConfidence,
      minTrackingConfidence: profile.minTrackingConfidence
    });
  }
}

function chooseQualityForFps(fps) {
  if (fps < 20) {
    return "emergency";
  }

  if (fps < 30) {
    return "low";
  }

  if (fps < 45) {
    return "balanced";
  }

  return "full";
}

function updateAdaptiveQuality(fps) {
  const nextQuality = chooseQualityForFps(fps);

  if (nextQuality !== currentQualityLevel) {
    applyQualityProfile(nextQuality);
  }
}

function updateIdleOptimization(now) {
  const shouldKeepSummonAwake = shouldRenderMahoraga();
  const isIdle = now - lastUserActivityTime > IDLE_OPTIMIZATION_MS && !shouldKeepSummonAwake;

  document.body.classList.toggle("performance-idle", isIdle);

  if (isIdle && isMahoragaRendererRunning) {
    stopMahoragaRenderLoop();
  }

  if (isIdle && isUnlimitedVoidRunning) {
    stopUnlimitedVoidRenderer();
  }

  if (isIdle && isDomainModelRendererRunning) {
    stopDomainModelRenderLoop();
  }

  if (isIdle && handTrackingAnimationId && currentStableGesture === GESTURES.NO_GESTURE) {
    suspendHandTrackingForIdle();
  }

  updatePerformanceHud();
}

function samplePerformance(time = performance.now()) {
  if (document.hidden) {
    performanceAnimationId = null;
    return;
  }

  performanceFrameCount += 1;

  if (!performanceLastSampleTime) {
    performanceLastSampleTime = time;
  }

  const elapsed = time - performanceLastSampleTime;

  if (elapsed >= 1000) {
    const fps = Math.round((performanceFrameCount * 1000) / elapsed);

    currentFps = fps;
    updateAdaptiveQuality(fps);
    updateIdleOptimization(Date.now());
    updatePerformanceHud(fps);
    performanceFrameCount = 0;
    performanceLastSampleTime = time;
  }

  performanceAnimationId = requestAnimationFrame(samplePerformance);
}

function startPerformanceMonitor() {
  if (performanceAnimationId) {
    return;
  }

  performanceLastSampleTime = 0;
  performanceFrameCount = 0;
  performanceAnimationId = requestAnimationFrame(samplePerformance);
}

function stopPerformanceMonitor() {
  if (!performanceAnimationId) {
    return;
  }

  cancelAnimationFrame(performanceAnimationId);
  performanceAnimationId = null;
}

function handleVisibilityChange() {
  document.body.classList.toggle("is-page-hidden", document.hidden);

  if (document.hidden) {
    stopUnlimitedVoidRenderer();
    stopMahoragaRenderLoop();
    stopDomainModelRenderLoop();
    stopHandTrackingLoop();
    stopPerformanceMonitor();

    if (audioContext && audioContext.state === "running") {
      audioContext.suspend().catch((error) => {
        console.warn("Audio suspend skipped:", error);
      });
    }

    return;
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume().catch((error) => {
      console.warn("Audio resume skipped:", error);
    });
  }

  markUserActivity();
  startPerformanceMonitor();

  if (systemStarted && isHandModelReady && Date.now() - lastUserActivityTime <= IDLE_OPTIMIZATION_MS) {
    startHandTrackingLoop();
  }

  if (shouldRenderMahoraga()) {
    startMahoragaRenderLoop();
  }

  if (shouldRenderUnlimitedVoid()) {
    startUnlimitedVoidRenderer();
  }

  if (shouldRenderDomainModel()) {
    startDomainModelRenderLoop();
  }
}

function disposeThreeMaterial(material) {
  if (!material) {
    return;
  }

  Object.keys(material).forEach((key) => {
    const value = material[key];

    if (value && value.isTexture) {
      value.dispose();
    }
  });

  material.dispose();
}

function disposeObject3D(root) {
  if (!root) {
    return;
  }

  root.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (!child.material) {
      return;
    }

    if (Array.isArray(child.material)) {
      child.material.forEach(disposeThreeMaterial);
    } else {
      disposeThreeMaterial(child.material);
    }
  });
}

function disposeMahoragaRenderer(options = {}) {
  const shouldForceContextLoss = Boolean(options.forceContextLoss);

  stopMahoragaRenderLoop();

  if (mahoragaRoot) {
    disposeObject3D(mahoragaRoot);
  }

  if (mahoragaRenderer) {
    mahoragaRenderer.dispose();

    if (shouldForceContextLoss) {
      mahoragaRenderer.forceContextLoss();
    }
  }

  mahoragaRenderer = null;
  mahoragaScene = null;
  mahoragaCamera = null;
  mahoragaRoot = null;
  mahoragaEyes = null;
  mahoragaModelPromise = null;
  mahoragaModelLoaded = false;
  mahoragaModelLoadFailed = false;
  mahoragaNeedsResize = true;
}

function disposeDomainModelRenderer(options = {}) {
  const shouldForceContextLoss = Boolean(options.forceContextLoss);

  stopDomainModelRenderLoop();

  if (domainModelLayer) {
    domainModelLayer.classList.remove("model-active");
  }

  shrineFallback?.classList.remove("fallback-active");

  if (domainModelRoot) {
    disposeObject3D(domainModelRoot);
  }

  if (domainModelRenderer) {
    domainModelRenderer.dispose();

    if (shouldForceContextLoss) {
      domainModelRenderer.forceContextLoss();
    }
  }

  domainModelRenderer = null;
  domainModelScene = null;
  domainModelCamera = null;
  domainModelRoot = null;
  domainModelPromise = null;
  activeDomainModelKey = "";
  domainModelNeedsResize = true;
}

// Browsers are more reliable when camera and mic requests happen after a user click.
async function startSystem() {
  if (systemStarted) {
    return;
  }

  markUserActivity();
  applyQualityProfile("full");
  startPerformanceMonitor();
  systemStarted = true;
  startSystemButton.disabled = true;
  startSystemButton.textContent = "System Starting...";
  emptyState.textContent = "Requesting camera permission...";
  updateCameraStatus("Requesting Camera Access...", "pending");
  updateMicrophoneStatus("Requesting Microphone...", "pending");

  await startCamera();
  await startVoiceRecognition();

  updateHandStatus("Hand Tracking Queued", "pending");
  setTimeout(startHandTrackingSystem, 350);
  startSystemButton.textContent = "System Active";
}

function openCommandGuide() {
  if (!commandGuideModal || !commandGuideButton) {
    return;
  }

  lastGuideFocus = document.activeElement;
  commandGuideModal.hidden = false;
  document.body.classList.add("guide-open");
  commandGuideButton.setAttribute("aria-expanded", "true");
  commandGuideClose?.focus();
}

function closeCommandGuide() {
  if (!commandGuideModal || !commandGuideButton) {
    return;
  }

  commandGuideModal.hidden = true;
  document.body.classList.remove("guide-open");
  commandGuideButton.setAttribute("aria-expanded", "false");

  if (lastGuideFocus && typeof lastGuideFocus.focus === "function") {
    lastGuideFocus.focus();
  }
}

function showWelcomeToast(operatorName) {
  if (!welcomeToast) {
    return;
  }

  clearTimeout(welcomeToastTimer);
  welcomeToast.textContent = operatorName
    ? `Welcome, Sorcerer ${operatorName}`
    : "Welcome, Sorcerer";
  welcomeToast.hidden = false;
  welcomeToast.classList.remove("toast-visible");
  void welcomeToast.offsetWidth;
  welcomeToast.classList.add("toast-visible");

  welcomeToastTimer = setTimeout(() => {
    welcomeToast.classList.remove("toast-visible");
    setTimeout(() => {
      welcomeToast.hidden = true;
    }, 260);
  }, 2600);
}

function unlockOperatorGate(operatorName) {
  if (!operatorGate) {
    return;
  }

  if (operatorDisplayName) {
    operatorDisplayName.textContent = operatorName || "Operator";
  }

  operatorGate.classList.add("gate-loading-active");
  operatorGateForm?.querySelector("button")?.setAttribute("disabled", "true");

  setTimeout(() => {
    document.body.classList.remove("gate-active");
    operatorGate.hidden = true;
    showWelcomeToast(operatorName);
  }, 900);
}

function handleOperatorGateSubmit(event) {
  event.preventDefault();
  const operatorName = operatorNameInput?.value.trim() || "";

  unlockOperatorGate(operatorName);
}

function initOperatorGate() {
  if (!operatorGate || !operatorGateForm) {
    document.body.classList.remove("gate-active");
    return;
  }

  operatorGate.hidden = false;
  operatorNameInput?.focus();
}

window.addEventListener("load", () => {
  setStartupPrompt();
  initOperatorGate();
});
operatorGateForm?.addEventListener("submit", handleOperatorGateSubmit);
startSystemButton.addEventListener("click", startSystem);
commandGuideButton?.addEventListener("click", openCommandGuide);
commandGuideClose?.addEventListener("click", closeCommandGuide);
commandGuideModal?.addEventListener("click", (event) => {
  if (event.target?.hasAttribute("data-guide-close")) {
    closeCommandGuide();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && commandGuideModal && !commandGuideModal.hidden) {
    closeCommandGuide();
  }
});
summonMahoragaButton.addEventListener("click", summonMahoragaDirectly);
document.addEventListener("visibilitychange", handleVisibilityChange);
["pointerdown", "pointermove", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, markUserActivity, { passive: true });
});
window.addEventListener("beforeunload", () => {
  disposeUnlimitedVoidRenderer();
  disposeMahoragaRenderer({ forceContextLoss: true });
  disposeDomainModelRenderer({ forceContextLoss: true });
});
window.addEventListener("resize", () => {
  markUserActivity();
  resizeCanvasToVideo();
  unlimitedVoidNeedsResize = true;
  resizeUnlimitedVoidRenderer();
  mahoragaNeedsResize = true;
  resizeMahoragaRenderer();
  domainModelNeedsResize = true;
  resizeDomainModelRenderer();
});

window.domainDebug = {
  activateDomainForGesture: (gesture) => activateDomainForGesture(gesture),
  activateMahoragaSummon: (options) => activateMahoragaSummon(options),
  resetDomain: () => resetDomain(),
  getEffectState: () => ({
    active: effectManager.active,
    quality: currentQualityLevel,
    summonLoaded: mahoragaModelLoaded,
    domainModelActive: Boolean(activeDomainModelKey)
  })
};
