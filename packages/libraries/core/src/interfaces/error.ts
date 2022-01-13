export interface Error {
  /**
   * Exit code value or false if none is available
   */
  exit?: number | false;

  /**
   * messsage to display related to the error
   */
  message?: string;

  /**
   * a unique error code for this error class
   */
  code?: string;

  /**
   * A documentation URL where to find out more information related to this error
   * or fixing the error
   */
  documentation?: string;

  /**
   * Some suggestions that may be useful or provide additional context
   */
  suggestions?: string[];
}
