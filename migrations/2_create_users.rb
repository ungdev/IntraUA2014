Sequel.migration do
  up do
    create_table(:users) do
      primary_key :id
      String   :username, :null=>false, :unique=>true
      String   :token, :text=>true, :null=>true
      DateTime :last_login
      TrueClass :admin, :null=>false, :default=>false 
    end
  end

  down do
    drop_table(:users)
  end
end