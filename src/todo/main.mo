import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";

actor {
    type Todo = {
        id: Nat;
        content: Text;
        completedAt: ?Text;
    };

    private stable var todoId:Nat = 0;

    let todosByOwner = HashMap.HashMap<Text, Buffer.Buffer<Todo>>(10, Text.equal, Text.hash);

    public shared ({ caller:Principal }) func add(content : Text):async [Todo] {
        todoId += 1;

        let owner = Principal.toText(caller);

        let newTodo : Todo = {
            id= todoId;
            content= Nat.toText(todoId) # content;
            completedAt= null;
        };

        let currentTodos: Buffer.Buffer<Todo> = switch (todosByOwner.get(owner)) {
            case (?todos) todos;
            case null Buffer.Buffer<Todo>(10);
        };

        currentTodos.add(newTodo);

        todosByOwner.put(owner, currentTodos);

        return Buffer.toArray(currentTodos);
    };

    public shared query ({ caller:Principal }) func getTodos(): async [Todo] {
        let owner = Principal.toText(caller);
        
        let todos: Buffer.Buffer<Todo> = switch (todosByOwner.get(owner)) {
            case (?todos) todos;
            case null Buffer.Buffer<Todo>(10);
        };

        return Buffer.toArray(todos);
    };


}