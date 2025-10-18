@0xb09bba32e59de543;

using Go = import "../std/go.capnp";
$Go.package("rpc");
$Go.import("github.com/kodr-pro/backend/internal/rpc");

# Generic RPC request for WebSocket transport
struct RPCRequest {
  # Unique request ID for correlation
  id @0 :Text;
  
  # Method name to invoke
  method @1 :Text;
  
  # Binary payload (Cap'n Proto encoded parameters)
  payload @2 :Data;
  
  # Optional metadata
  metadata @3 :List(KeyValue);
  
  struct KeyValue {
    key @0 :Text;
    value @1 :Text;
  }
}

# Generic RPC response for WebSocket transport
struct RPCResponse {
  # Correlates with request ID
  id @0 :Text;
  
  # Response payload
  result :union {
    # Success case - binary Cap'n Proto encoded result
    success @1 :Data;
    
    # Error case
    error @2 :RPCError;
  }
  
  # Optional metadata
  metadata @3 :List(RPCRequest.KeyValue);
}

# Error structure
struct RPCError {
  code @0 :Int32;
  message @1 :Text;
  details @2 :Text;
}

# Batch request support for efficiency
struct RPCBatch {
  requests @0 :List(RPCRequest);
}

# Batch response
struct RPCBatchResponse {
  responses @0 :List(RPCResponse);
}
