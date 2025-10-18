@0xf0f0f0f0f0f0f0f0;

using Go = import "../std/go.capnp";
$Go.package("rpc");
$Go.import("github.com/kodr-pro/backend/internal/rpc");

using Services = import "rpc_services.capnp";

# Main interface that aggregates all services
interface MainInterface {
  # Get authentication service
  getAuthService @0 () -> (service :Services.AuthService);
  
  # Get user service
  getUserService @1 () -> (service :Services.UserService);
  
  # Get project service
  getProjectService @2 () -> (service :Services.ProjectService);
  
  # Get collaboration service
  getCollaborationService @3 () -> (service :Services.CollaborationService);
  
  # Get event service
  getEventService @4 () -> (service :Services.EventService);
}
