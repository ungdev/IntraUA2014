Sequel.migration do
  up do
    create_table(:tournaments) do
      primary_key :id
      String   :title, :null=>false, :unique=>true
      String   :description, :text=>true, :null=>false
      Integer  :owner_id, :null=>false
      Integer  :capacity, :null=>false
      Integer  :teamSize, :null=>false, :default=>1
      foreign_key  [:owner_id], :users, :key=>:id, :foreign_key_constraint_name=>'fk_owner_users', :name=>:owner_fk
    end
  end

  down do
    drop_table(:tournaments)
  end
end