Sequel.migration do
  up do
    create_table(:challenge_tokens) do
      primary_key :id
      String   :value, :null=>false, :unique=>true
      Integer  :challenge_id, :null=>false
      Integer  :position, :null=>true
       foreign_key  [:challenge_id], :challenges, :key=>:id, :foreign_key_constraint_name=>'fk_challenge_tokens_challenge_challenge_fkey'
    end
  end

  down do
    drop_table(:challenge_token)
  end
end