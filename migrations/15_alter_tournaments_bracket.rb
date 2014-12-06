Sequel.migration do
  up do
    alter_table(:tournaments) do
       add_column :data_teamsSub5to8, String, :text=>true
       add_column :data_resultsSub5to8, String, :text=>true
       add_column :data_teamsSub9to16, String, :text=>true
       add_column :data_resultsSub9to16, String, :text=>true
       add_column :data_teamsSub13to16, String, :text=>true
       add_column :data_resultsSub13to16, String, :text=>true
    end
  end

  down do
    alter_table(:tournaments) do
       drop_column :data_teamsSub5to8
       drop_column :data_resultsSub5to8
       drop_column :data_teamsSub9to16
       drop_column :data_resultsSub9to16
       drop_column :data_teamsSub13to16
       drop_column :data_resultsSub13to16
    end
  end
end
