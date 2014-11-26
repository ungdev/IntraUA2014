Sequel.migration do
  up do
    create_table(:challenges_tokens) do
      primary_key :id
      String   :value, :null=>false, :unique=>true
    end
  end

  down do
    drop_table(:challenges)
  end
end