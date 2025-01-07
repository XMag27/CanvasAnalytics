import { Spinner } from "@instructure/ui";
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="h-100 w-full flex flex-col items-center align-center">
      <Spinner
        renderTitle="Cargando Contenido..."
        size="large"
        margin="0 0 0 medium"
      />
    </div>
  );
}
