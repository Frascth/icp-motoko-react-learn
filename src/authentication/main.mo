import Principal "mo:base/Principal";

actor {
    public query (message) func Whoami():async Principal {
        return message.caller;
    }
};