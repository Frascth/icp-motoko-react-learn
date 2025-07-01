import Principal "mo:base/Principal";

actor {
    public query (message) func whoami():async Principal {
        return message.caller;
    }
};