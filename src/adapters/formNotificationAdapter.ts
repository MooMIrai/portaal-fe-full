import { InputEmailStructure, OutputEmailStructure } from "../models/MessageForm";
import { BaseAdapter } from 'common/gof/Adapter';
import AuthService from 'common/services/AuthService';

class FormNotificationAdaper extends BaseAdapter<InputEmailStructure, OutputEmailStructure> {

  removeHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  adapt(source?: InputEmailStructure): OutputEmailStructure {
    if (!source) {
      throw new Error("Source object is required");
    }

    const detailsUsersNotifications: OutputEmailStructure['detailsUsersNotifications'] = [];

    // Popolamento delle notifiche degli utenti (to, cc, bcc)
    const emailTypes = {
      to: 'to',
      cc: 'cc',
      bcc: 'bcc'
    };

    // Itera su ciascuna sezione per creare la lista delle notifiche
    ['to', 'cc', 'bcc'].forEach(type => {
      if (source[type]) {
        source[type].forEach(user => {
          detailsUsersNotifications.push({
            id: user.account_id,
            email: user.email,
            emailSendType: emailTypes[type]
          });
        });
      }
    });

    // Determina la flag isGlobal e emailSendType per detailsGlobal
    const isGlobal = source.isAll ? true : false;
    const emailSendTypeGlobal = isGlobal ? 'cc' : 'to'; // Puoi adattare a seconda delle tue logiche

    return {
      manager_account_id: AuthService.getData().sub, // Cambia se necessario
      detailsUsersNotifications,
      emailToSend: source.isEmail || false,
      notify_response_type_id: source.responseType.id,
      content: {
        title: source.title || "",
        sub_title: source.sub_title || "",
        text: source.text // Poiché `emailToSend` è `false`, `text` è sempre vuoto
      },
      detailsGlobal: {
        isGlobal,
        emailSendType: emailSendTypeGlobal
      },
      isFlagged: false,
      emailDetails: source.isEmail ? {
        subject: (source.title + (source.sub_title?` - ${source.sub_title}`:'')) || "",
        text: this.removeHtmlTags(source.text || ""),
        html_text: source.text || "", // Utilizza il testo come HTML
        attachments: source.attachments?.create.map(att => att)
      } : undefined
    };
  }

  reverseAdapt(source?: OutputEmailStructure): InputEmailStructure {
    if (!source) {
      throw new Error("Source object is required");
    }

    const to = source.detailsUsersNotifications.filter(user => user.emailSendType === 'to');
    const cc = source.detailsUsersNotifications.filter(user => user.emailSendType === 'cc');
    const bcc = source.detailsUsersNotifications.filter(user => user.emailSendType === 'bcc');

    return {
      responseType: {
        id: source.notify_response_type_id,
        responseType: "LINK",
        description: null,
        validations: null,
        tenant_code: "TAAL"
      },
      isAll: source.detailsGlobal.isGlobal ? 'cc' : null,
      to: to.map(user => ({
        account_id: user.id,
        person_id: 0, // Aggiungere il valore corretto se disponibile
        firstName: "", // Aggiungere il valore corretto se disponibile
        lastName: "", // Aggiungere il valore corretto se disponibile
        email: user.email,
        nominativo: "" // Aggiungere il valore corretto se disponibile
      })),
      cc: cc.map(user => ({
        account_id: user.id,
        person_id: 0,
        firstName: "",
        lastName: "",
        email: user.email,
        nominativo: ""
      })),
      bcc: bcc.map(user => ({
        account_id: user.id,
        person_id: 0,
        firstName: "",
        lastName: "",
        email: user.email,
        nominativo: ""
      })),
      isEmail: source.emailToSend,
      attachments: { create: source.emailDetails?.attachments.map(att => ({
        name: att.file_name,
        data: att.data || [],
        size: att.data?.length || 0,
        status: 2, // Aggiungere lo stato corretto
        file_name: att.file_name,
        content_type: att.content_type,
        extension: att.file_name.split('.').pop() || "",
        provider: "DRIVE", // Aggiungere il provider corretto
        property: "attachments" // Aggiungere la proprietà corretta
      })) || [] },
      title: source.content.title,
      sub_title: source.content.sub_title,
      text: source.content.text
    };
  }
}


export const formNotificationAdapter = new FormNotificationAdaper();