interface defaultSuccessResponseInterface {
  type?: string;
  data?: Array<any> | object | null | string | number;
  message?: string | null;
  count?: number | null;
  pagination?: Array<any> | object | null;
  error?: null | {
    message?: string | Array<any> | object | null;
    failedValidationMessages?: string | Array<any> | object | null;
    stack?: string | Array<any> | object | null;
  };
}

interface defaultErrorResponseInterface {
  type?: string;
  error?: {
    message?: string | Array<any> | object | null;
    failedValidationMessages?: string | Array<any> | object | null;
    stack?: string | Array<any> | object | null;
  };
}

export { defaultSuccessResponseInterface, defaultErrorResponseInterface };
