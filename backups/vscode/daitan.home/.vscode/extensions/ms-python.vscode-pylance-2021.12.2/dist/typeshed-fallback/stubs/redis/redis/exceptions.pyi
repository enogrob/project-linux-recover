class RedisError(Exception): ...
class AuthenticationError(RedisError): ...
class ConnectionError(RedisError): ...
class TimeoutError(RedisError): ...
class BusyLoadingError(ConnectionError): ...
class InvalidResponse(RedisError): ...
class ResponseError(RedisError): ...
class DataError(RedisError): ...
class PubSubError(RedisError): ...
class WatchError(RedisError): ...
class NoScriptError(ResponseError): ...
class ExecAbortError(ResponseError): ...
class ReadOnlyError(ResponseError): ...
class NoPermissionError(ResponseError): ...
class ModuleError(ResponseError): ...
class LockError(RedisError, ValueError): ...
class LockNotOwnedError(LockError): ...
class ChildDeadlockedError(Exception): ...
class AuthenticationWrongNumberOfArgsError(ResponseError): ...