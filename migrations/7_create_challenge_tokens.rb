Sequel.migration do
  up do
    create_table(:challenges_tokens) do
      primary_key :id
      String   :value, :null=>false, :unique=>true
      Integer  :challenge_id, :null=>false
      Integer  :position, :null=>true
      foreign_key  [:challenge_id], :challenges, :key=>:id, :foreign_key_constraint_name=>'fk_challenge_challenges'
    end
  end

  down do
    drop_table(:challenges)
  end
end