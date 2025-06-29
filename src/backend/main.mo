import RBTree "mo:base/RBTree";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor {

  var votes : RBTree.RBTree<Text, Nat> = RBTree.RBTree(Text.compare);

  public query func greet(name : Text): async Text {
    return "Hello " # name # " !";
  };

  public query func getVotes() : async [(Text, Nat)] {
    return Iter.toArray(votes.entries());
  };

  public func resetVotes() : async [(Text, Nat)] {
    votes.put("Motoko", 0);
    votes.put("Rust", 0);
    votes.put("TypeScript", 0);
    votes.put("Python", 0);

    return Iter.toArray(votes.entries());
  };

  public func vote(category : Text) : async [(Text, Nat)] {
    if (category == "") {
      return await getVotes();
    };

    let category_count : ?Nat = votes.get(category);

    let current_count : Nat = switch category_count {
      case null 0;
      case (?Nat) Nat;
    };

    votes.put(category, current_count + 1);

    return Iter.toArray(votes.entries());
  };

};
