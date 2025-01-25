"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = void 0;
const resetPasswordTemplate = (props) => `
  <div>
    <h1>Hola, ${props.name}</h1>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
    <a href="${props.resetLink}" target="_blank">Restablecer contraseña</a>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
  </div>
`;
exports.resetPasswordTemplate = resetPasswordTemplate;
