Sequel.migration do
  up do
    alter_table(:users) do
       add_column :point, Integer, :null=>false, :default=>0
    end
  end

  down do
    alter_table(:users) do
       drop_column :point
    end
  end
end