import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import List "mo:core/List";

actor {
  type AnimalRecord = {
    animal_id : Text;
    farm_id : Text;
    species : Text; // cow/goat/sheep
    temperature : Float;
    movement_level : Text; // LOW/MEDIUM/HIGH
    heart_rate : Nat;
    cough_count : Nat;
    location : Text; // Tamil Nadu district
    timestamp : Int;
    health_status : Text; // Healthy/Monitor/Alert
    detected_condition : Text; // None/FMD Risk/PPR Risk/Infection Risk
  };

  module AnimalRecord {
    public func compare(record1 : AnimalRecord, record2 : AnimalRecord) : Order.Order {
      if (record1.timestamp < record2.timestamp) {
        #less;
      } else if (record1.timestamp > record2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  type Alert = {
    alert_id : Text;
    animal_id : Text;
    message : Text;
    timestamp : Int;
    severity : Text; // warning/critical
  };

  module Alert {
    public func compare(alert1 : Alert, alert2 : Alert) : Order.Order {
      if (alert1.timestamp < alert2.timestamp) {
        #less;
      } else if (alert1.timestamp > alert2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  let animalRecords = Map.empty<Text, List.List<AnimalRecord>>();
  let alerts = List.empty<Alert>();

  public shared ({ caller }) func submitRecord(record : AnimalRecord) : async () {
    var totalRecords = 0;
    for ((_, records) in animalRecords.entries()) {
      totalRecords += records.size();
    };

    if (totalRecords >= 500) { Runtime.trap("Record limit reached. Maximum 500 records allowed.") };

    let animal_id = record.animal_id;
    let newRecord = { record with timestamp = Time.now() };

    let recordsList = switch (animalRecords.get(animal_id)) {
      case (null) {
        let list = List.empty<AnimalRecord>();
        list.add(newRecord);
        list;
      };
      case (?existingRecords) {
        existingRecords.add(newRecord);
        existingRecords;
      };
    };

    animalRecords.add(animal_id, recordsList);
  };

  public query ({ caller }) func getRecords() : async [AnimalRecord] {
    animalRecords.entries().map(func((_, recordsList)) { recordsList.values() }).flatten().toArray();
  };

  public shared ({ caller }) func submitAlert(alert : Alert) : async () {
    alerts.add({ alert with timestamp = Time.now() });
  };

  public query ({ caller }) func getAlerts() : async [Alert] {
    alerts.toArray();
  };

  public shared ({ caller }) func clearOldRecords(keepCount : Nat) : async () {
    for ((animal_id, records) in animalRecords.entries()) {
      let size = records.size();
      if (size > keepCount) {
        let sorted = records.toArray().sort().sliceToArray(0, keepCount);
        let newRecords = List.fromArray<AnimalRecord>(sorted);
        animalRecords.add(animal_id, newRecords);
      };
    };
  };

  public query ({ caller }) func getStats() : async { totalRecords : Nat; totalAlerts : Nat } {
    var totalRecords = 0;
    for ((_, records) in animalRecords.entries()) {
      totalRecords += records.size();
    };

    {
      totalRecords;
      totalAlerts = alerts.size();
    };
  };
};
