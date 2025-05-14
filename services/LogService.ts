class LogService {
  private static instance: LogService;

  private constructor() {}

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  log(message: string, data?: any) {
    console.log(`[${new Date().toISOString()}] ${message}`, data || '');
  }

  error(message: string, error?: any) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '');
  }

  warn(message: string, data?: any) {
    console.warn(`[${new Date().toISOString()}] WARNING: ${message}`, data || '');
  }
}

export default LogService; 