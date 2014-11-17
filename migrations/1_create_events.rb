Sequel.migration do
  up do
    create_table(:events) do
      primary_key :id
      String   :title, :null=>false, :unique=>true
      String   :description, :text=>true, :null=>false
      DateTime :date, :null=> false
    end
  end

  down do
    drop_table(:events)
  end
end