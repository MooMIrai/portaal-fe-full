export interface InputEmailStructure {
    responseType: string;
    isAll: string | null;
    to: User[];
    cc: User[];
    bcc: User[];
    isEmail: boolean;
    attachments: {
      create: Attachment[];
    };
    title: string;
    sub_title: string;
    text: string;
  }
  
  interface User {
    account_id: number;
    person_id: number;
    firstName: string;
    lastName: string;
    email: string;
    nominativo: string;
  }
  
  interface Attachment {
    name: string;
    data: number[];
    size: number;
    status: number;
    file_name: string;
    content_type: string;
    extension: string;
    provider: string;
    property: string;
  }
  
  export interface OutputEmailStructure {
    manager_account_id: number;
    detailsUsersNotifications: UserNotification[];
    emailToSend: boolean;
    responseType: string;
    content: Content;
    detailsGlobal: DetailsGlobal;
    isFlagged: boolean;
    emailDetails: EmailDetails | undefined;
  }
  
  interface UserNotification {
    id: number;
    email: string;
    emailSendType: 'to' | 'cc' | 'bcc';
  }
  
  interface Content {
    title: string;
    sub_title: string;
    text: string;
  }
  
  interface DetailsGlobal {
    isGlobal: boolean;
    emailSendType: 'to' | 'cc' | 'bcc';
  }
  
  interface EmailDetails {
    subject: string;
    text: string;
    html_text: string;
    attachments: Attachment[];
  }
  